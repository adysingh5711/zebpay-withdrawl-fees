import { TokenPrice, ApiConfig } from './api-types';
export declare class ZebPayClient {
    private client;
    private config;
    constructor(config: ApiConfig);
    fetchTokenPrice(symbol: string): Promise<TokenPrice>;
    fetchMultipleTokenPrices(symbols: string[]): Promise<TokenPrice[]>;
    validateApiConnection(): Promise<boolean>;
    private handleApiError;
    private createApiError;
    private sleep;
}
//# sourceMappingURL=zebpay-client.d.ts.map