import { MagpieConfig, ApiResponse } from '../types';
export declare class MagpieClient {
    private paymentsApi;
    private checkoutApi;
    private requestsApi;
    private linksApi;
    private config;
    constructor(config: MagpieConfig);
    private createApiInstance;
    private handleApiError;
    private makeRequest;
    createSource(data: any): Promise<ApiResponse>;
    getSource(sourceId: string): Promise<ApiResponse>;
    createCharge(data: any): Promise<ApiResponse>;
    getCharge(chargeId: string): Promise<ApiResponse>;
    listCharges(startAfter?: string): Promise<ApiResponse>;
    captureCharge(chargeId: string, data: any): Promise<ApiResponse>;
    voidCharge(chargeId: string): Promise<ApiResponse>;
    refundCharge(chargeId: string, data: any): Promise<ApiResponse>;
    createCheckoutSession(data: any): Promise<ApiResponse>;
    getCheckoutSession(sessionId: string): Promise<ApiResponse>;
    listCheckoutSessions(): Promise<ApiResponse>;
    expireCheckoutSession(sessionId: string): Promise<ApiResponse>;
    captureCheckoutSession(sessionId: string): Promise<ApiResponse>;
    createPaymentRequest(data: any): Promise<ApiResponse>;
    getPaymentRequest(requestId: string): Promise<ApiResponse>;
    listPaymentRequests(params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<ApiResponse>;
    voidPaymentRequest(requestId: string, data: any): Promise<ApiResponse>;
    resendPaymentRequest(requestId: string): Promise<ApiResponse>;
    createPaymentLink(data: any): Promise<ApiResponse>;
    getPaymentLink(linkId: string): Promise<ApiResponse>;
    listPaymentLinks(params?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<ApiResponse>;
    updatePaymentLink(linkId: string, data: any): Promise<ApiResponse>;
    activatePaymentLink(linkId: string): Promise<ApiResponse>;
    deactivatePaymentLink(linkId: string): Promise<ApiResponse>;
}
