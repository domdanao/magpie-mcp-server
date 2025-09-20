"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagpieClient = void 0;
const axios_1 = __importDefault(require("axios"));
class MagpieClient {
    constructor(config) {
        this.config = config;
        // Create separate axios instances for different APIs
        this.paymentsApi = this.createApiInstance('https://api.pay.magpie.im');
        this.checkoutApi = this.createApiInstance('https://api.pay.magpie.im');
        this.requestsApi = this.createApiInstance('https://request.magpie.im/api');
        this.linksApi = this.createApiInstance('https://buy.magpie.im/api');
    }
    createApiInstance(baseURL) {
        const instance = axios_1.default.create({
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
        instance.interceptors.response.use((response) => response, (error) => {
            const apiError = this.handleApiError(error);
            return Promise.reject(apiError);
        });
        return instance;
    }
    handleApiError(error) {
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
        }
        else if (error.request) {
            // Network error
            return {
                success: false,
                error: {
                    type: 'network_error',
                    message: 'No response received from server',
                }
            };
        }
        else {
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
    async makeRequest(api, method, path, data) {
        try {
            const response = await api.request({
                method,
                url: path,
                data,
            });
            return {
                success: true,
                data: response.data,
            };
        }
        catch (error) {
            return error;
        }
    }
    // Payments API methods
    async createSource(data) {
        return this.makeRequest(this.paymentsApi, 'POST', '/v2/sources/', data);
    }
    async getSource(sourceId) {
        return this.makeRequest(this.paymentsApi, 'GET', `/v2/sources/${sourceId}`);
    }
    async createCharge(data) {
        return this.makeRequest(this.paymentsApi, 'POST', '/v2/charges/', data);
    }
    async getCharge(chargeId) {
        return this.makeRequest(this.paymentsApi, 'GET', `/v2/charges/${chargeId}`);
    }
    async listCharges(startAfter) {
        const params = startAfter ? `?start_after=${startAfter}` : '';
        return this.makeRequest(this.paymentsApi, 'GET', `/v2/charges/${params}`);
    }
    async captureCharge(chargeId, data) {
        return this.makeRequest(this.paymentsApi, 'POST', `/v2/charges/${chargeId}/capture`, data);
    }
    async voidCharge(chargeId) {
        return this.makeRequest(this.paymentsApi, 'POST', `/v2/charges/${chargeId}/void`);
    }
    async refundCharge(chargeId, data) {
        return this.makeRequest(this.paymentsApi, 'POST', `/v2/charges/${chargeId}/refund`, data);
    }
    // Checkout API methods
    async createCheckoutSession(data) {
        return this.makeRequest(this.checkoutApi, 'POST', '/', data);
    }
    async getCheckoutSession(sessionId) {
        return this.makeRequest(this.checkoutApi, 'GET', `/${sessionId}`);
    }
    async listCheckoutSessions() {
        return this.makeRequest(this.checkoutApi, 'GET', '/');
    }
    async expireCheckoutSession(sessionId) {
        return this.makeRequest(this.checkoutApi, 'POST', `/${sessionId}/expire`);
    }
    async captureCheckoutSession(sessionId) {
        return this.makeRequest(this.checkoutApi, 'POST', `/${sessionId}/capture`);
    }
    // Payment Requests API methods
    async createPaymentRequest(data) {
        return this.makeRequest(this.requestsApi, 'POST', '/v1/requests', data);
    }
    async getPaymentRequest(requestId) {
        return this.makeRequest(this.requestsApi, 'GET', `/v1/requests/${requestId}`);
    }
    async listPaymentRequests(params) {
        const query = params ? new URLSearchParams(params).toString() : '';
        return this.makeRequest(this.requestsApi, 'GET', `/v1/requests${query ? '?' + query : ''}`);
    }
    async voidPaymentRequest(requestId, data) {
        return this.makeRequest(this.requestsApi, 'POST', `/v1/requests/${requestId}/void`, data);
    }
    async resendPaymentRequest(requestId) {
        return this.makeRequest(this.requestsApi, 'POST', `/v1/requests/${requestId}/resend`);
    }
    // Payment Links API methods
    async createPaymentLink(data) {
        return this.makeRequest(this.linksApi, 'POST', '/v1/links', data);
    }
    async getPaymentLink(linkId) {
        return this.makeRequest(this.linksApi, 'GET', `/v1/links/${linkId}`);
    }
    async listPaymentLinks(params) {
        const query = params ? new URLSearchParams(params).toString() : '';
        return this.makeRequest(this.linksApi, 'GET', `/v1/links${query ? '?' + query : ''}`);
    }
    async updatePaymentLink(linkId, data) {
        return this.makeRequest(this.linksApi, 'PUT', `/v1/links/${linkId}`, data);
    }
    async activatePaymentLink(linkId) {
        return this.makeRequest(this.linksApi, 'POST', `/v1/links/${linkId}/activate`);
    }
    async deactivatePaymentLink(linkId) {
        return this.makeRequest(this.linksApi, 'POST', `/v1/links/${linkId}/deactivate`);
    }
}
exports.MagpieClient = MagpieClient;
//# sourceMappingURL=magpie-client.js.map