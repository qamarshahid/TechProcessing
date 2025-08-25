import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface PaymentRequest {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
}

@Injectable()
export class AuthorizeNetService {
  private apiLoginId: string;
  private transactionKey: string;
  private environment: string;

  constructor(private configService: ConfigService) {
    this.apiLoginId = this.configService.get<string>('AUTHORIZENET_API_LOGIN_ID');
    this.transactionKey = this.configService.get<string>('AUTHORIZENET_TRANSACTION_KEY');
    this.environment = this.configService.get<string>('AUTHORIZENET_ENVIRONMENT', 'sandbox');
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    try {
      // In a real implementation, you would use the Authorize.Net SDK
      // For demo purposes, we'll simulate the payment processing
      
      if (!this.apiLoginId || !this.transactionKey) {
        throw new Error('Authorize.Net credentials not configured');
      }

      // Simulate payment processing
      const isTestCard = paymentRequest.cardNumber === '4111111111111111';
      const success = isTestCard || Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        return {
          success: true,
          transactionId: this.generateTransactionId(),
          message: 'Payment processed successfully',
        };
      } else {
        return {
          success: false,
          error: 'Payment declined by bank',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}