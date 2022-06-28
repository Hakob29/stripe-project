import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthService } from '../service/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';



@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    //REGISTER FOR STRIPE USER 
    @Post("/register")
    async register(@Body() registerUser: RegisterUserDto){
        return this.authService.register(registerUser);
    }

    //LOGIN FOR STRIPE USER 
    @Post("/login")
    async login(@Body() loginUser: LoginUserDto){
        return this.authService.login(loginUser);
    }
}
