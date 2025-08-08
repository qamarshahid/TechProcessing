import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateHostedPaymentDto } from '../dto/create-hosted-payment.dto';

export interface HostedPaymentResponse {
  token: string;
  hostedPaymentUrl: string;
  expiresAt: string;
}

@Injectable()
export class HostedPaymentService {
  private apiLoginId: string;
  private transactionKey: string;
  private environment: string;

  constructor(private configService: ConfigService) {
    this.apiLoginId = this.configService.get<string>('AUTHORIZENET_API_LOGIN_ID');
    this.transactionKey = this.configService.get<string>('AUTHORIZENET_TRANSACTION_KEY');
    this.environment = this.configService.get<string>('AUTHORIZENET_ENVIRONMENT', 'sandbox');
  }

  async createHostedPaymentToken(paymentData: CreateHostedPaymentDto): Promise<HostedPaymentResponse> {
    try {
      // In a real implementation, you would use the Authorize.Net SDK
      // For demo purposes, we'll simulate the hosted payment token generation
      
      if (!this.apiLoginId || !this.transactionKey) {
        throw new Error('Authorize.Net credentials not configured');
      }

      // Generate a mock hosted payment token
      const token = this.generatePaymentToken();
      const baseUrl = this.environment === 'sandbox' 
        ? 'https://test.authorize.net/payment/payment'
        : 'https://accept.authorize.net/payment/payment';

      const hostedPaymentUrl = `${baseUrl}?token=${token}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      return {
        token,
        hostedPaymentUrl,
        expiresAt: expiresAt.toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to create hosted payment token: ${error.message}`);
    }
  }

  private generatePaymentToken(): string {
    return `HPT_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  async validateWebhookSignature(payload: string, signature: string): Promise<boolean> {
    // In a real implementation, validate the webhook signature
    // For demo purposes, we'll return true
    return true;
  }
}