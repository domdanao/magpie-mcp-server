"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAPIParser = void 0;
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class OpenAPIParser {
    static parseSpec(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const spec = yaml.load(content);
        const endpoints = [];
        // Parse paths and operations
        for (const [pathKey, pathValue] of Object.entries(spec.paths || {})) {
            const pathObj = pathValue;
            for (const [method, operation] of Object.entries(pathObj)) {
                if (typeof operation === 'object' && operation !== null) {
                    const op = operation;
                    endpoints.push({
                        operationId: op.operationId || `${method}_${pathKey.replace(/[^a-zA-Z0-9]/g, '_')}`,
                        method: method.toUpperCase(),
                        path: pathKey,
                        summary: op.summary || '',
                        description: op.description || '',
                        parameters: op.parameters || [],
                        requestBody: op.requestBody,
                        responses: op.responses || {},
                        tags: op.tags || []
                    });
                }
            }
        }
        return {
            info: spec.info,
            servers: spec.servers || [],
            endpoints
        };
    }
    static parseAllSpecs() {
        const apiDir = path.join(process.cwd(), 'api-reference');
        const specs = {};
        const files = [
            { key: 'payments', file: 'payments.yaml' },
            { key: 'checkout', file: 'checkout.yaml' },
            { key: 'requests', file: 'requests.yaml' },
            { key: 'links', file: 'links.yaml' }
        ];
        for (const { key, file } of files) {
            const filePath = path.join(apiDir, file);
            if (fs.existsSync(filePath)) {
                specs[key] = this.parseSpec(filePath);
            }
        }
        return specs;
    }
}
exports.OpenAPIParser = OpenAPIParser;
//# sourceMappingURL=openapi-parser.js.map