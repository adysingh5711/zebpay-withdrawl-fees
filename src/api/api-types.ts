export interface TokenPrice {
    symbol: string;
    priceINR: number;
    priceUSD: number;
    timestamp: Date;
}

export interface ZebPayTickerResponse {
    buy: string;
    sell: string;
    market: string;
    volumeEx: number;
    volumeQt: number;
    pricechange: string;
    "24hoursHigh": string;
    "24hoursLow": string;
    quickTradePrice: string;
    pair: string;
    virtualCurrency: string;
    currency: string;
    volume: number;
    quickTradePriceChange: string;
}

export interface ValidationResult {
    success: boolean;
    method: 'primary' | 'fallback' | 'health-check';
    testedTokens: string[];
    errors: ValidationError[];
    warnings?: string[];
}

export interface ValidationError {
    token: string;
    error: string;
    statusCode?: number;
    timestamp: Date;
}

export interface ValidationConfig {
    primaryToken: string;
    fallbackTokens: string[];
    maxRetries: number;
    retryDelay: number;
    timeout: number;
    healthCheckEndpoint?: string;
}

export interface ApiError extends Error {
    type: 'RATE_LIMIT' | 'NETWORK_ERROR' | 'INVALID_RESPONSE' | 'API_ERROR' | 'TOKEN_NOT_FOUND' | 'TIMEOUT';
    statusCode?: number;
    retryAfter?: number;
    attempt?: number;
    token?: string;
    retryable: boolean;
    context: {
        attempt: number;
        timestamp: Date;
        endpoint: string;
    };
}

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    validation: ValidationConfig;
}

export interface TokenConfig {
    name: string;
    symbol: string;
    withdrawalFee: number;
}

export interface ProcessedToken {
    id: string; // Original token key (e.g., "USDT_TRC20")
    name: string;
    symbol: string;
    priceINR: number;
    priceUSD: number;
    withdrawalFeeNative: number;
    withdrawalFeeINR: number;
    withdrawalFeeUSD: number;
}