import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { firebaseAdminProvider } from 'src/configs';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/configs/configuration';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  controllers: [AuthController],
  providers: [firebaseAdminProvider, AuthService],
})
export class AuthModule {}
