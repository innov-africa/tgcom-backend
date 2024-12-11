import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import Mailgen from 'mailgen';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';

@Injectable()
export class MailService {
  mailGenerator: Mailgen;
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // this.mailGenerator = new Mailgen({
    //   theme: configService.get('mail.mailgen.theme'),
    //   product: {
    //     // Appears in header & footer of e-mails
    //     name: configService.get('resources.appname'),
    //     link: configService.get('resources.website'),
    //     // Optional product logo
    //     logo: configService.get('resources.logo'),
    //     logoHeight: configService.get('mail.mailgen.logoHeight'),
    //   },
    // });
    // this.sendOtp({ otp: '123456', to: 'k0d3.s0n1k@gmail.com' });
  }

  async send(sendMailDto: { emails: string[]; subject: string; message: string }) {
    try {
      const promises = [];
      sendMailDto.emails.map((email) =>
        promises.push(
          this.mailerService.sendMail({
            from: this.configService.get('mail.sender'),
            to: email,
            subject: sendMailDto.subject,
            text: sendMailDto.message,
          }),
        ),
      );
      return Promise.all(promises);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async sendTemplate(sendMailDto: any) {
    try {
      const html = this.mailGenerator.generate(sendMailDto.message);
      const promises = [];
      sendMailDto.emails.map((email) =>
        promises.push(
          this.mailerService.sendMail({
            from: this.configService.get('mail.sender'),
            to: email,
            subject: sendMailDto.subject,
            html,
          }),
        ),
      );
      return Promise.all(promises);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async sendPassword(data: { password: string; to: string }) {
    const message = {
      body: {
        greeting: 'Cher',
        signature: 'Cordialement',
        name: 'utilisateur',
        title:
          'Mot de passe de connexion',
        action: {
          instructions:
            "Vore compte a été créé avec succès. Veuillez saisir ce mot de passe afin de procéder à la connexion:  ",
          button: {
            color: this.configService.get('resource.primaryColor'), // Optional action button color
            text: data.password,
            link: this.configService.get('resources.website'),
          },
        },
        outro:
          "Si vous n'avez demandé aucune vérification d'email, veuillez ignorer cet e-mail.",
      },
    };
    return await this.sendTemplate({
      emails: [data.to],
      subject: 'OTP',
      message,
    });
  }

}