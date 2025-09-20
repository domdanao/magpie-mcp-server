import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { MagpieConfig, ApiResponse } from '../types';

export class MagpieClient {
  private paymentsApi: AxiosInstance;
  private checkoutApi: AxiosInstance;
  private requestsApi: AxiosInstance;
  private linksApi: AxiosInstance;
  private config: MagpieConfig;

  constructor(config: MagpieConfig) {
    this.config = config;
    
    // Create separate axios instances for different APIs
    this.paymentsApi = this.createApiInstance('https://api.pay.magpie.im');
    this.checkoutApi = this.createApiInstance('https://api.pay.magpie.im');
    this.requestsApi = this.createApiInstance('https://request.magpie.im/api');
    this.linksApi = this.createApiInstance('https://buy.magpie.im/api');
  }

  private createApiInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add request interceptor for authentication
    instance.interceptors.request.use((config) => {
      const credentials = Buffer.from(`${this.config.apiKey}:${this.config.secretKey}`).toString('base64');
      config.headers.Authorization = `Basic ${credentials}`;
      return config;
    });

    // Add response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.handleApiError(error);
        return Promise.reject(apiError);
      }
    );

    return instance;
  }

  private handleApiError(error: AxiosError): ApiResponse {
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: {
          type: 'api_error',
          message: error.response.data ? 
            (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) :
            `HTTP ${error.response.status}: ${error.response.statusText}`,
          code: error.response.status.toString(),
        }
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: {
          type: 'network_error',
          message: 'No response received from server',
        }
      };
    } else {
      // Other error
      return {
        success: false,
        error: {
          type: 'unknown_error',
          message: error.message || 'Unknown error occurred',
        }
      };
    }
  }

  private async makeRequest<T>(
    api: AxiosInstance, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
    path: string, 
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await api.request({
        method,
        url: path,
        data,
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return error as ApiResponse;
    }
  }

  // Payments API methods
  async createSource(data: any): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'POST', '/v2/sources/', data);
  }

  async getSource(sourceId: string): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'GET', `/v2/sources/${sourceId}`);
  }

  async createCharge(data: any): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'POST', '/v2/charges/', data);
  }

  async getCharge(chargeId: string): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'GET', `/v2/charges/${chargeId}`);
  }

  async listCharges(startAfter?: string): Promise<ApiResponse> {
    const params = startAfter ? `?start_after=${startAfter}` : '';
    return this.makeRequest(this.paymentsApi, 'GET', `/v2/charges/${params}`);
  }

  async captureCharge(chargeId: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'POST', `/v2/charges/${chargeId}/capture`, data);
  }

  async voidCharge(chargeId: string): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'POST', `/v2/charges/${chargeId}/void`);
  }

  async refundCharge(chargeId: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApi, 'POST', `/v2/charges/${chargeId}/refund`, data);
  }

  // Checkout API methods
  async createCheckoutSession(data: any): Promise<ApiResponse> {
    return this.makeRequest(this.checkoutApi, 'POST', '/', data);
  }

  async getCheckoutSession(sessionId: string): Promise<ApiResponse> {
    return this.makeRequest(this.checkoutApi, 'GET', `/${sessionId}`);
  }

  async listCheckoutSessions(): Promise<ApiResponse> {
    return this.makeRequest(this.checkoutApi, 'GET', '/');
  }

  async expireCheckoutSession(sessionId: string): Promise<ApiResponse> {
    return this.makeRequest(this.checkoutApi, 'POST', `/${sessionId}/expire`);
  }

  async captureCheckoutSession(sessionId: string): Promise<ApiResponse> {
    return this.makeRequest(this.checkoutApi, 'POST', `/${sessionId}/capture`);
  }

  // Payment Requests API methods
  async createPaymentRequest(data: any): Promise<ApiResponse> {
    return this.makeRequest(this.requestsApi, 'POST', '/v1/requests', data);
  }

  async getPaymentRequest(requestId: string): Promise<ApiResponse> {
    return this.makeRequest(this.requestsApi, 'GET', `/v1/requests/${requestId}`);
  }

  async listPaymentRequests(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.makeRequest(this.requestsApi, 'GET', `/v1/requests${query ? '?' + query : ''}`);
  }

  async voidPaymentRequest(requestId: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(this.requestsApi, 'POST', `/v1/requests/${requestId}/void`, data);
  }

  async resendPaymentRequest(requestId: string): Promise<ApiResponse> {
    return this.makeRequest(this.requestsApi, 'POST', `/v1/requests/${requestId}/resend`);
  }

  // Payment Links API methods
  async createPaymentLink(data: any): Promise<ApiResponse> {
    return this.makeRequest(this.linksApi, 'POST', '/v1/links', data);
  }

  async getPaymentLink(linkId: string): Promise<ApiResponse> {
    return this.makeRequest(this.linksApi, 'GET', `/v1/links/${linkId}`);
  }

  async listPaymentLinks(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.makeRequest(this.linksApi, 'GET', `/v1/links${query ? '?' + query : ''}`);
  }

  async updatePaymentLink(linkId: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(this.linksApi, 'PUT', `/v1/links/${linkId}`, data);
  }

  async activatePaymentLink(linkId: string): Promise<ApiResponse> {
    return this.makeRequest(this.linksApi, 'POST', `/v1/links/${linkId}/activate`);
  }

  async deactivatePaymentLink(linkId: string): Promise<ApiResponse> {
    return this.makeRequest(this.linksApi, 'POST', `/v1/links/${linkId}/deactivate`);
  }
}