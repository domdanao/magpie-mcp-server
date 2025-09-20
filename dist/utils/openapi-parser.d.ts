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
export declare class OpenAPIParser {
    static parseSpec(filePath: string): OpenAPISpec;
    static parseAllSpecs(): Record<string, OpenAPISpec>;
}
