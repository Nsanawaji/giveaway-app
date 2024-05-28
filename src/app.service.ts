import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailservice: MailerService) {}
  forgotPassword() {
    const message =
      "Forgot your password? If you didn't forget your password ignore this message!";


  }
}

