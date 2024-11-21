
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
export const firebaseAdminProvider: FactoryProvider<App> = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
      const firebaseConfig = {
        type: configService.get<string>('firebase.type'),
        project_id: configService.get<string>('firebase.project_id'),
        private_key_id: configService.get<string>('firebase.private_key_id'),
        private_key: configService.get<string>('firebase.private_key'),
        client_email: configService.get<string>('firebase.client_email'),
        client_id: configService.get<string>('firebase.client_id'),
        auth_uri: configService.get<string>('firebase.auth_uri'),
        token_uri: configService.get<string>('firebase.token_uri'),
        auth_provider_x509_cert_url: configService.get<string>(
          'firebase.auth_provider_x509_cert_url',
        ),
        client_x509_cert_url: configService.get<string>('firebase.client_x509_cert_url'),
      universe_domain: configService.get<string>('firebase.universe_domain'),
    } as admin.ServiceAccount;

    return admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
        storageBucket: `${firebaseConfig.projectId}.appspot.com`,
      });
    },
  };