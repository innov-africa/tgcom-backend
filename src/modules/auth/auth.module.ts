import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configs/configuration';
import { FirebaseModule } from '../firebase.module';

@Module({
  imports: [ConfigModule.forFeature(configuration), FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
