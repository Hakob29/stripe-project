import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  UseFilters,
} from '@nestjs/common';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UpdateUserDto } from '../dto/update-users.dto';
import { UsersService } from '../service/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from '../../execptions/All-Execptions.filter';
import { UseInterceptors } from '@nestjs/common';
import { SentryInterceptor } from '../../execptions/sentry-Interceptor';

@UseInterceptors(SentryInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //CREATE USER
  @Post('/create')
  async createUser(@Body() createUser: CreateUsersDto) {
    return await this.usersService.createUser(createUser);
  }

  //GET ALL USERS
  @Get('/get')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  //GET USER BY ID
  @Get('/get/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  //DELETE USER
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  //UPDATE USER BY ID
  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUser);
  }
}
