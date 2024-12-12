import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CollectionReference, Firestore, FieldValue } from 'firebase-admin/firestore';
import { app } from 'firebase-admin';
import { Auth } from 'firebase-admin/auth';
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

      await this.userCollection
        .doc(account.uid)
        .set({
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
      await this.userCollection.doc(id).update({ deletedAt: FieldValue.serverTimestamp() });
      return { message: 'Account deleted' };
    } catch (error) {
      Logger.error(error.message, 'Delete Account');
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

