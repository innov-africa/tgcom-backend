export class CreateAuthDto {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    role: 'admin' | 'accountant' | 'cashier';
}
