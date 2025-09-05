import { ContactFormData, AppointmentData } from './emailService';

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

class BackendEmailService {
  private async makeRequest(endpoint: string, data: any): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/email/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Backend email service error:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again or contact us directly.'
      };
    }
  }

  async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    return await this.makeRequest('contact', data);
  }

  async sendAppointmentRequest(data: AppointmentData): Promise<{ success: boolean; message: string }> {
    return await this.makeRequest('appointment', data);
  }
}

export const backendEmailService = new BackendEmailService();
