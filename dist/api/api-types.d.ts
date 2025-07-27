export interface TokenPrice {
    symbol: string;
    price: number;
    currency: 'INR';
    timestamp: Date;
}
export interface ZebPayTickerResponse {
    market: string;
    buy: string;
    sell: string;
    volume: string;
}
export interface ApiError extends Error {
    type: 'RATE_LIMIT' | 'NETWORK_ERROR' | 'INVALID_RESPONSE' | 'API_ERROR';
    statusCode?: number;
    retryAfter?: number;
    attempt?: number;
}
export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
}
export interface TokenConfig {
    name: string;
    symbol: string;
    withdrawalFee: number;
    amount: number;
}
export interface ProcessedToken {
    name: string;
    symbol: string;
    price: number;
    amount: number;
    inrValue: number;
    withdrawalFeeNative: number;
    withdrawalFeeInr: number;
}
//# sourceMappingURL=api-types.d.ts.map