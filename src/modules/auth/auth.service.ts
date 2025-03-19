import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  CollectionReference,
  Firestore,
  FieldValue,
} from 'firebase-admin/firestore';
import { app } from 'firebase-admin';
import { Auth } from 'firebase-admin/auth';
import { ChangePasswordDto } from './dto/change-password';
@Injectable()
export class AuthService {
  auth: Auth;
  db: Firestore;
  userCollection: CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.auth = this.firebaseApp.auth();
    this.db = this.firebaseApp.firestore();
    this.userCollection = this.db.collection('users');
  }

  private generatePassword(length: number = 10): string {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }

  private maskPhone(phone: string, length: number = 8): string {
    const firstPart = phone.slice(0, 2);
    const lastPart = phone.slice(length - 1, length);
    const partToMask = phone.slice(2, length - 1);
    return firstPart + partToMask.replace(/\d/g, '*') + lastPart;
  }

  async resetPassword(changePasswordDto: ChangePasswordDto) {
    try {
      const accounts = await this.userCollection
        .where('email', '==', changePasswordDto.email)
        .get();
      if (accounts.empty) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      const account: any = {
        ...accounts.docs[0].data(),
        id: accounts.docs[0].id,
      };
      console.log(account);
      if (account.email !== changePasswordDto.email) {
        throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
      }
      await this.auth.updateUser(account.id, { password: account.phone });
      await this.userCollection
        .doc(account.id)
        .update({ hasChangedPassword: true });
      // Mask the phone number 9******1
      const maskedPhone = this.maskPhone(account.phone);
      console.log(maskedPhone);
      return {
        message: `Votre mot de passe a été réinitialisé avec succès. Veuillez utiliser le numéro ${maskedPhone} comme mot de passe.`,
        success: true,
      };
    } catch (error) {
      Logger.error(error.message, 'Change Password');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createAccount(createAccount: CreateAuthDto) {
    try {
      // const password = this.generatePassword(8);
      const password = createAccount.phone;
      Logger.log(password);
      const account = await this.firebaseApp.auth().createUser({
        email: createAccount.email,
        password,
      });
      // Logger.log(account);

      await this.userCollection.doc(account.uid).set({
        ...createAccount,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        deletedAt: null,
        avatar: '',
      });

      // TODO: Send email with password to user

      return { id: account.uid, ...createAccount, password };
    } catch (error) {
      Logger.error(error.message, 'Create Account');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteAccount(id: string) {
    try {
      await this.firebaseApp.auth().deleteUser(id);
      await this.userCollection
        .doc(id)
        .update({ deletedAt: FieldValue.serverTimestamp() });
      return { message: 'Account deleted' };
    } catch (error) {
      Logger.error(error.message, 'Delete Account');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
