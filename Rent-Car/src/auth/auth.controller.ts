import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
  ConflictException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Admin } from 'typeorm';
import { Roles } from 'src/common/decorators/roles.decorator';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { ResetPasswdDto } from './dto/resetPasswd.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 403, description: 'forbidden' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(@Body() body) {
    const { email, oldPassword, newPassword, confirmNewPassword } = body;
    return this.authService.resetPassword(
      email,
      oldPassword,
      newPassword,
      confirmNewPassword,
    );
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Backup user password | forgot pass' })
  async forgotPassword(@Body() body) {
    const { email } = body;
    return this.authService.forgotPassword(email);
  }

  @Post('verifypass')
  @ApiOperation({ summary: 'Will get link from email for this endpoint' })
  async verifyPassword(@Body() body: ResetPasswdDto, @Query() param) {
    const { password, newPassword } = body;
    const { token } = param;
    return this.authService.confirmPassword(token, password, newPassword);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'email verification' })
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    const { token, email } = verifyEmailDto;
    await this.authService.verifyEmail(token, email);
    return { message: 'Email verified successfully' };
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'get new tokens' })
  @UseGuards(JwtAuthGuard)
  @Post('renew-tokens')
  async renewTokens(@Request() req) {
    return this.authService.renewTokens(req.user);
  }
}
