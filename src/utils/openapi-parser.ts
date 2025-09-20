import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface OpenAPIEndpoint {
  operationId: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters: any[];
  requestBody?: any;
  responses: any;
  tags: string[];
}

export interface OpenAPISpec {
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  endpoints: OpenAPIEndpoint[];
}

export class OpenAPIParser {
  static parseSpec(filePath: string): OpenAPISpec {
    const content = fs.readFileSync(filePath, 'utf8');
    const spec = yaml.load(content) as any;
    
    const endpoints: OpenAPIEndpoint[] = [];
    
    // Parse paths and operations
    for (const [pathKey, pathValue] of Object.entries(spec.paths || {})) {
      const pathObj = pathValue as any;
      
      for (const [method, operation] of Object.entries(pathObj)) {
        if (typeof operation === 'object' && operation !== null) {
          const op = operation as any;
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
  
  static parseAllSpecs(): Record<string, OpenAPISpec> {
    const apiDir = path.join(process.cwd(), 'api-reference');
    const specs: Record<string, OpenAPISpec> = {};
    
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