import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeUsers } from 'src/entity';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from 'src/strategy/jwt-strategy';


@Module({
  imports: [
  TypeOrmModule.forFeature([StripeUsers]),
    JwtModule.register({
      secret: "super-secret-shark"
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
