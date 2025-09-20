"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMagpieResources = createMagpieResources;
function createMagpieResources() {
    return [
        {
            uri: 'magpie://api/payments/schema',
            name: 'Magpie Payments API Schema',
            description: 'OpenAPI specification for the Magpie Payments API (Sources and Charges)',
            mimeType: 'application/x-yaml'
        },
        {
            uri: 'magpie://api/checkout/schema',
            name: 'Magpie Checkout API Schema',
            description: 'OpenAPI specification for the Magpie Checkout Sessions API',
            mimeType: 'application/x-yaml'
        },
        {
            uri: 'magpie://api/requests/schema',
            name: 'Magpie Payment Requests API Schema',
            description: 'OpenAPI specification for the Magpie Payment Requests API',
            mimeType: 'application/x-yaml'
        },
        {
            uri: 'magpie://api/links/schema',
            name: 'Magpie Payment Links API Schema',
            description: 'OpenAPI specification for the Magpie Payment Links API',
            mimeType: 'application/x-yaml'
        },
        {
            uri: 'magpie://api/documentation',
            name: 'Magpie API Documentation',
            description: 'Comprehensive documentation for all Magpie payment APIs',
            mimeType: 'text/markdown'
        }
    ];
}
//# sourceMappingURL=index.js.map