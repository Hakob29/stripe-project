import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StripeUsers } from 'src/entity';
import { RegisterUserDto } from '../dto/register-user.dto';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StripeUsers) private readonly StrupeUserRepository: Repository<StripeUsers>,
    private readonly jwtService: JwtService,
  ) {}

  //REGISTER USER 
  async register(registerUser: RegisterUserDto){

    const newStripeUser = await this.StrupeUserRepository.create(registerUser);

    return await this.StrupeUserRepository.save(newStripeUser);
  }


  //LOGIN USER 
  async login(loginUser: LoginUserDto) {
    const userDB = await this.StrupeUserRepository.findOne({
      where: { email: loginUser.email },
    });
    // console.log(userDB);
    if (!userDB) throw new UnauthorizedException('User Failed...');
    if (userDB.password !== loginUser.password)
      throw new UnauthorizedException('User failed...');

    return this.userSign(loginUser.id, loginUser.email, 'User');
  }

  async userSign(userId: number, email: string, type: string) {
    return this.jwtService.sign({
      sub: userId,
      email: email,
      type: type,
    });
  }
}
