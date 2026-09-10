import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetCode(email: string, code: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.MAIL_FROM!,
        to: email,
        subject: 'Reset your PlanDa password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Reset your password</h2>

            <p>
              You requested to reset your PlanDa password.
            </p>

            <p>Your verification code is:</p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 24px 0;
            ">
              ${code}
            </div>

            <p>
              This code expires in 10 minutes.
            </p>

            <p>
              If you didn't request a password reset, you can safely ignore
              this email.
            </p>
          </div>
        `,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Failed to send password reset email:', error);

      throw new InternalServerErrorException(
        'Failed to send password reset email',
      );
    }
  }
}
