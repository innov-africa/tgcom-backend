
import { Module } from '@nestjs/common';
import { firebaseAdminProvider } from 'src/configs';

@Module({
  providers: [firebaseAdminProvider],
  exports: [firebaseAdminProvider],
})
export class FirebaseModule {}
