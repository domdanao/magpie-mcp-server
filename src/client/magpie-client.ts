import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { MagpieConfig, ApiResponse } from '../types';

export class MagpieClient {
  private paymentsApiPublic: AxiosInstance;  // For source creation (uses public key)
  private paymentsApiSecret: AxiosInstance;  // For charges and other operations (uses secret key)
  private checkoutApi: AxiosInstance;
  private requestsApi: AxiosInstance;
  private linksApi: AxiosInstance;
  private config: MagpieConfig;

  constructor(config: MagpieConfig) {
    this.config = config;

    // Create separate axios instances for different APIs and authentication
    // Using exact URLs from OpenAPI specifications
    const paymentsBaseUrl = config.paymentsBaseUrl || 'https://api.magpie.im';
    const checkoutBaseUrl = config.checkoutBaseUrl || 'https://api.pay.magpie.im';
    const requestsBaseUrl = config.requestsBaseUrl || 'https://request.magpie.im/api';
    const linksBaseUrl = config.linksBaseUrl || 'https://buy.magpie.im/api';

    this.paymentsApiPublic = this.createApiInstance(paymentsBaseUrl, true);  // Uses public key
    this.paymentsApiSecret = this.createApiInstance(paymentsBaseUrl, false); // Uses secret key
    this.checkoutApi = this.createApiInstance(checkoutBaseUrl, false);       // Uses secret key
    this.requestsApi = this.createApiInstance(requestsBaseUrl, false);       // Uses secret key
    this.linksApi = this.createApiInstance(linksBaseUrl, false);             // Uses secret key
  }

  private createApiInstance(baseURL: string, usePublicKey: boolean = false): AxiosInstance {
    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Add request interceptor for authentication
    instance.interceptors.request.use((config) => {
      // Use public key for source creation, secret key for everything else
      const authKey = usePublicKey ? this.config.publicKey : this.config.secretKey;
      const credentials = Buffer.from(`${authKey}:`).toString('base64');
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
    const requestUrl = error.config?.baseURL ? `${error.config.baseURL}${error.config.url}` : error.config?.url || 'Unknown URL';
    const method = error.config?.method?.toUpperCase() || 'Unknown Method';

    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      let errorMessage = `${method} ${requestUrl} - HTTP ${error.response.status}: ${error.response.statusText}`;

      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage += `\nResponse: ${errorData}`;
        } else {
          errorMessage += `\nResponse: ${JSON.stringify(errorData, null, 2)}`;
        }
      }

      return {
        success: false,
        error: {
          type: 'api_error',
          message: errorMessage,
          code: error.response.status.toString(),
        }
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: {
          type: 'network_error',
          message: `Network error attempting ${method} ${requestUrl} - No response received from server`,
        }
      };
    } else {
      // Other error
      return {
        success: false,
        error: {
          type: 'unknown_error',
          message: `Error with ${method} ${requestUrl} - ${error.message || 'Unknown error occurred'}`,
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
    // Source creation uses public key
    return this.makeRequest(this.paymentsApiPublic, 'POST', '/v2/sources/', data);
  }

  async getSource(sourceId: string): Promise<ApiResponse> {
    // Source retrieval uses secret key
    return this.makeRequest(this.paymentsApiSecret, 'GET', `/v2/sources/${sourceId}`);
  }

  async createCharge(data: any): Promise<ApiResponse> {
    // All charge operations use secret key
    return this.makeRequest(this.paymentsApiSecret, 'POST', '/v2/charges/', data);
  }

  async getCharge(chargeId: string): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApiSecret, 'GET', `/v2/charges/${chargeId}`);
  }

  async listCharges(startAfter?: string): Promise<ApiResponse> {
    const params = startAfter ? `?start_after=${startAfter}` : '';
    return this.makeRequest(this.paymentsApiSecret, 'GET', `/v2/charges/${params}`);
  }

  async captureCharge(chargeId: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApiSecret, 'POST', `/v2/charges/${chargeId}/capture`, data);
  }

  async voidCharge(chargeId: string): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApiSecret, 'POST', `/v2/charges/${chargeId}/void`);
  }

  async refundCharge(chargeId: string, data: any): Promise<ApiResponse> {
    return this.makeRequest(this.paymentsApiSecret, 'POST', `/v2/charges/${chargeId}/refund`, data);
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