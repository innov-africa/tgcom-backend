import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MailService } from './services/mail/mail.service';
import configuration from './configs/configuration';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    NotificationModule,
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule], // Assurez-vous d'importer ConfigModule si vous utilisez ConfigService
    //   useFactory: async (configService: ConfigService) => ({
    //     transport: {
    //       host: configService.get('mail.transport.host'), // Replace with your SMTP server host
    //       port: configService.get('mail.transport.port'), // Replace with your SMTP server port (common ports are 587 or 465)
    //       secure: configService.get('mail.transport.secure'), // Set to true if your SMTP server uses secure connection (TLS)
    //       auth: {
    //         user: configService.get('mail.auth.user'), // Replace with your email address
    //         pass: configService.get('mail.auth.pass'), // Replace with your email password (consider using environment variables for security)
    //       },
    //     },
    //   }),
    //   inject: [ConfigService], // Injectez ConfigService pour l'utiliser dans useFactory
    // }),
  ],
  controllers: [AppController],
  providers: [AppService,
    //  MailService
    ],
})
export class AppModule {}
