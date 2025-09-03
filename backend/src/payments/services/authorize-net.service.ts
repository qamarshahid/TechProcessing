import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface PaymentRequest {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  email?: string;
  phone?: string;
  description?: string;
  invoiceNumber?: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
  error?: string;
  authCode?: string;
  avsResult?: string;
  cvvResult?: string;
  gatewayResponse?: any;
}

interface PaymentLinkRequest {
  amount: number;
  description: string;
  customerEmail?: string;
  expiresAt?: Date;
  allowPartialPayment?: boolean;
  metadata?: any;
}

interface PaymentLinkResult {
  success: boolean;
  token?: string;
  hostedPaymentUrl?: string;
  error?: string;
}
@Injectable()
export class AuthorizeNetService {
  private apiLoginId: string;
  private transactionKey: string;
  private environment: string;
  private apiEndpoint: string;

  constructor(private configService: ConfigService) {
    this.apiLoginId = this.configService.get<string>('AUTHORIZENET_API_LOGIN_ID');
    this.transactionKey = this.configService.get<string>('AUTHORIZENET_TRANSACTION_KEY');
    this.environment = this.configService.get<string>('AUTHORIZENET_ENVIRONMENT', 'sandbox');
    this.apiEndpoint = this.environment === 'production' 
      ? 'https://api.authorize.net/xml/v1/request.api'
      : 'https://apitest.authorize.net/xml/v1/request.api';
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    try {
      // Validate credentials
      if (!this.apiLoginId || !this.transactionKey) {
        return {
          success: false,
          error: 'Authorize.Net credentials not configured'
        };
      }

      // Create payment request XML
      const paymentXML = this.createPaymentRequestXML(paymentRequest);
      
      // Send request to Authorize.Net
      const response = await this.sendAuthorizeNetRequest(paymentXML);
      
      return this.parsePaymentResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  }

  async createPaymentLink(linkRequest: PaymentLinkRequest): Promise<PaymentLinkResult> {
    try {
      // Validate credentials
      if (!this.apiLoginId || !this.transactionKey) {
        return {
          success: false,
          error: 'Authorize.Net credentials not configured'
        };
      }

      // Create hosted payment request XML
      const hostedPaymentXML = this.createHostedPaymentRequestXML(linkRequest);
      
      // Send request to Authorize.Net
      const response = await this.sendAuthorizeNetRequest(hostedPaymentXML);
      
      return this.parseHostedPaymentResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Payment link creation failed'
      }
    }
  }

  private createPaymentRequestXML(paymentRequest: PaymentRequest): string {
    const transactionId = this.generateTransactionId();
    
    return `<?xml version="1.0" encoding="utf-8"?>
<createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${this.apiLoginId}</name>
    <transactionKey>${this.transactionKey}</transactionKey>
  </merchantAuthentication>
  <transactionRequest>
    <transactionType>authCaptureTransaction</transactionType>
    <amount>${paymentRequest.amount.toFixed(2)}</amount>
    <payment>
      <creditCard>
        <cardNumber>${paymentRequest.cardNumber.replace(/\s/g, '')}</cardNumber>
        <expirationDate>${paymentRequest.expiryDate.replace('/', '')}</expirationDate>
        <cardCode>${paymentRequest.cvv}</cardCode>
      </creditCard>
    </payment>
    ${paymentRequest.billingAddress ? `
    <billTo>
      <firstName>${paymentRequest.billingAddress.firstName || ''}</firstName>
      <lastName>${paymentRequest.billingAddress.lastName || ''}</lastName>
      <address>${paymentRequest.billingAddress.address || ''}</address>
      <city>${paymentRequest.billingAddress.city || ''}</city>
      <state>${paymentRequest.billingAddress.state || ''}</state>
      <zip>${paymentRequest.billingAddress.zipCode || ''}</zip>
      <country>${paymentRequest.billingAddress.country || 'US'}</country>
    </billTo>
    ` : ''}
    ${paymentRequest.email ? `
    <customer>
      <email>${paymentRequest.email}</email>
    </customer>
    ` : ''}
    <order>
      <invoiceNumber>${paymentRequest.invoiceNumber || transactionId}</invoiceNumber>
      <description>${paymentRequest.description || 'Payment'}</description>
    </order>
    <merchantDescriptor>Tech Processing LLC</merchantDescriptor>
  </transactionRequest>
</createTransactionRequest>`;
  }

  private createHostedPaymentRequestXML(linkRequest: PaymentLinkRequest): string {
    const token = this.generateSecureToken();
    
    return `<?xml version="1.0" encoding="utf-8"?>
<getHostedPaymentPageRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${this.apiLoginId}</name>
    <transactionKey>${this.transactionKey}</transactionKey>
  </merchantAuthentication>
  <transactionRequest>
    <transactionType>authCaptureTransaction</transactionType>
    <amount>${linkRequest.amount.toFixed(2)}</amount>
    <order>
      <description>${linkRequest.description}</description>
    </order>
    ${linkRequest.customerEmail ? `
    <customer>
      <email>${linkRequest.customerEmail}</email>
    </customer>
    ` : ''}
  </transactionRequest>
  <hostedPaymentSettings>
    <setting>
      <settingName>hostedPaymentReturnOptions</settingName>
      <settingValue>{"showReceipt": true, "url": "${this.getReturnUrl()}", "urlText": "Continue", "cancelUrl": "${this.getCancelUrl()}", "cancelUrlText": "Cancel"}</settingValue>
    </setting>
    <setting>
      <settingName>hostedPaymentButtonOptions</settingName>
      <settingValue>{"text": "Pay Now"}</settingValue>
    </setting>
    <setting>
      <settingName>hostedPaymentStyleOptions</settingName>
      <settingValue>{"bgColor": "blue"}</settingValue>
    </setting>
  </hostedPaymentSettings>
</getHostedPaymentPageRequest>`;
  }

  private async sendAuthorizeNetRequest(xmlData: string): Promise<any> {
    // In a real implementation, you would send this to Authorize.Net
    // For demo purposes, we'll simulate the response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure based on test data
    const isTestCard = xmlData.includes('4111111111111111');
    const success = isTestCard || Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      return {
        transactionResponse: {
          responseCode: '1',
          authCode: this.generateAuthCode(),
          transId: this.generateTransactionId(),
          messages: [{
            code: '1',
            description: 'This transaction has been approved.'
          }],
          avsResultCode: 'Y',
          cvvResultCode: 'P'
        }
      };
    } else {
      return {
        transactionResponse: {
          responseCode: '2',
          errors: [{
            errorCode: '2',
            errorText: 'This transaction has been declined.'
          }]
        }
      };
    }
  }

  private parsePaymentResponse(response: any): PaymentResult {
    const transactionResponse = response.transactionResponse;
    
    if (transactionResponse.responseCode === '1') {
      return {
        success: true,
        transactionId: transactionResponse.transId,
        authCode: transactionResponse.authCode,
        avsResult: transactionResponse.avsResultCode,
        cvvResult: transactionResponse.cvvResultCode,
        message: transactionResponse.messages?.[0]?.description || 'Transaction approved',
        gatewayResponse: transactionResponse
      };
    } else {
      return {
        success: false,
        error: transactionResponse.errors?.[0]?.errorText || 'Transaction declined',
        gatewayResponse: transactionResponse
      };
    }
  }

  private parseHostedPaymentResponse(response: any): PaymentLinkResult {
    // Parse hosted payment response
    if (response.token) {
      const baseUrl = this.environment === 'production' 
        ? 'https://accept.authorize.net/payment/payment'
        : 'https://test.authorize.net/payment/payment';
        
      return {
        success: true,
        token: response.token,
        hostedPaymentUrl: `${baseUrl}?token=${response.token}`
      };
    } else {
      return {
        success: false,
        error: 'Failed to create hosted payment page'
      };
    }
  }

  private generateAuthCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private getReturnUrl(): string {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    return `${baseUrl}/payment/success`;
  }

  private getCancelUrl(): string {
    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    return `${baseUrl}/payment/cancel`;
  }

  // Legacy method for backward compatibility
  async processCardPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    return this.processPayment(paymentRequest);
  }

  // Method to validate webhook signatures
  async validateWebhookSignature(payload: string, signature: string): Promise<boolean> {
    try {
      // Create HMAC signature using transaction key
      const expectedSignature = crypto
        .createHmac('sha512', this.transactionKey)
        .update(payload)
        .digest('hex')
        .toUpperCase();

      return signature.toUpperCase() === expectedSignature;
    } catch (error) {
      console.error('Webhook signature validation error:', error);
      return false;
    }
  }

  // Method to process refunds
  async processRefund(transactionId: string, amount?: number): Promise<PaymentResult> {
    try {
      if (!this.apiLoginId || !this.transactionKey) {
        return {
          success: false,
          error: 'Authorize.Net credentials not configured'
        };
      }

      // Create refund request XML
      const refundXML = this.createRefundRequestXML(transactionId, amount);
      
      // Send request to Authorize.Net
      const response = await this.sendAuthorizeNetRequest(refundXML);
      
      return this.parsePaymentResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Refund processing failed'
      };
    }
  }

  private createRefundRequestXML(transactionId: string, amount?: number): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<createTransactionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${this.apiLoginId}</name>
    <transactionKey>${this.transactionKey}</transactionKey>
  </merchantAuthentication>
  <transactionRequest>
    <transactionType>refundTransaction</transactionType>
    ${amount ? `<amount>${amount.toFixed(2)}</amount>` : ''}
    <refTransId>${transactionId}</refTransId>
  </transactionRequest>
</createTransactionRequest>`;
  }

  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Method to get transaction details
  async getTransactionDetails(transactionId: string): Promise<any> {
    try {
      if (!this.apiLoginId || !this.transactionKey) {
        throw new Error('Authorize.Net credentials not configured');
      }

      // Create transaction details request XML
      const detailsXML = `<?xml version="1.0" encoding="utf-8"?>
<getTransactionDetailsRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">
  <merchantAuthentication>
    <name>${this.apiLoginId}</name>
    <transactionKey>${this.transactionKey}</transactionKey>
  </merchantAuthentication>
  <transId>${transactionId}</transId>
</getTransactionDetailsRequest>`;

      // Send request to Authorize.Net
      const response = await this.sendAuthorizeNetRequest(detailsXML);
      
      return response;
    } catch (error) {
      throw new Error(`Failed to get transaction details: ${error.message}`);
    }
  }
}