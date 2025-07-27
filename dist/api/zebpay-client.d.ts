import { TokenPrice, ApiConfig, ValidationResult } from './api-types';
export declare class ZebPayClient {
    private client;
    private config;
    private exchangeRateClient;
    private cachedUsdRate;
    private rateLastFetched;
    constructor(config: ApiConfig);
    fetchTokenPrice(symbol: string): Promise<TokenPrice>;
    fetchMultipleTokenPrices(symbols: string[]): Promise<TokenPrice[]>;
    validateApiConnection(): Promise<ValidationResult>;
    private validateWithToken;
    private performBasicHealthCheck;
    private getUsdExchangeRate;
    private categorizeValidationError;
    private isRetryableError;
    private createEnhancedApiError;
    private createApiError;
    private sleep;
}
//# sourceMappingURL=zebpay-client.d.ts.map