import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-account')
  async create(@Body() createAccountDto: CreateAuthDto) {
    try {
      const doc = await this.authService.createAccount(createAccountDto);
      const message = 'Success!!!';
      return { message, success: true, data: doc };
    } catch (error) {
      // Logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: string) {
    try {
      return await this.authService.deleteAccount(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
