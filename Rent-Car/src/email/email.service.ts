import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
  userService: any;
  jwtService: any;
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}&email=${email}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `Please verify your email by clicking this link <a href=${url}>VERIFY</a>`, // Context data for your template
    });
  }
  async sendVerificationEmailForgotPass(email: string, token: string) {
    const url = `http://localhost:3000/auth/verifypass?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      html: `Please use this link to reset your password <a href=${url}>VERIFY</a>`, // Context data for your template
    });
  }
  async verifyEmail(token: string) {
    const { userId } = this.jwtService.verify(token);
    await this.userService.verifyEmail(userId);
  }
}
