import axios from 'axios';
import { TokenPrice, ZebPayTickerResponse, ApiError, ApiConfig, ValidationResult } from './api-types';

interface ExchangeRateResponse {
    rates: {
        USD: number;
    };
}

export class ZebPayClient {
    private client: any;
    private config: ApiConfig;
    private exchangeRateClient: any;
    private cachedUsdRate: number | null = null;
    private rateLastFetched: Date | null = null;

    constructor(config: ApiConfig) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'crypto-price-tracker/1.0.0'
            }
        });

        this.exchangeRateClient = axios.create({
            baseURL: 'https://api.exchangerate-api.com/v4',
            timeout: 10000,
            headers: {
                'User-Agent': 'crypto-price-tracker/1.0.0'
            }
        });
    }

    async fetchTokenPrice(symbol: string): Promise<TokenPrice> {
        let lastError: ApiError;

        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                // Use the new API endpoint that returns all market data
                const response = await this.client.get('/market');

                if (!response.data || !Array.isArray(response.data)) {
                    throw this.createApiError('INVALID_RESPONSE', `Invalid response format from API`, 0, attempt);
                }

                // Handle USDT_TRC20 as USDT
                const searchSymbol = symbol === 'USDT_TRC20' ? 'USDT' : symbol;

                // Find the token in the response array
                const tokenData = response.data.find((item: ZebPayTickerResponse) =>
                    item.virtualCurrency === searchSymbol && item.currency === 'INR'
                );

                if (!tokenData) {
                    throw this.createApiError('TOKEN_NOT_FOUND', `Token ${symbol} not found in market data`, 0, attempt);
                }

                // Try to get price from buy field first, then fall back to market field
                const priceString = tokenData.buy || tokenData.market;
                if (!priceString) {
                    throw this.createApiError('INVALID_RESPONSE', `No price available for ${symbol}`, 0, attempt);
                }

                const priceINR = parseFloat(priceString);
                if (isNaN(priceINR) || priceINR <= 0) {
                    throw this.createApiError('INVALID_RESPONSE', `Invalid price for ${symbol}: ${priceString}`, 0, attempt);
                }

                // Get USD exchange rate and convert INR to USD
                const usdRate = await this.getUsdExchangeRate();
                const priceUSD = priceINR * usdRate;

                return {
                    symbol,
                    priceINR,
                    priceUSD: Math.round(priceUSD * 100000000) / 100000000, // Round to 8 decimal places
                    timestamp: new Date()
                };

            } catch (error) {
                lastError = this.categorizeValidationError(error, symbol, attempt);

                if (attempt < this.config.retryAttempts && this.isRetryableError(lastError)) {
                    const delay = this.config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`Retrying ${symbol} in ${delay}ms (attempt ${attempt + 1}/${this.config.retryAttempts})`);
                    await this.sleep(delay);
                } else {
                    break;
                }
            }
        }

        throw lastError!;
    }

    async fetchMultipleTokenPrices(symbols: string[]): Promise<TokenPrice[]> {
        const results: TokenPrice[] = [];
        const errors: { symbol: string; error: string }[] = [];

        try {
            console.log('📡 Fetching market data from ZebPay...');

            // Fetch all market data in one API call
            const response = await this.client.get('/market');

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid response format from API');
            }

            console.log(`📊 Received market data for ${response.data.length} trading pairs`);

            // Get USD exchange rate once for all conversions
            const usdRate = await this.getUsdExchangeRate();
            console.log(`💱 USD exchange rate: 1 INR = ${usdRate} USD`);

            // Create a map of available tokens for quick lookup
            const marketDataMap = new Map<string, ZebPayTickerResponse>();
            response.data.forEach((item: ZebPayTickerResponse) => {
                if (item.currency === 'INR' && item.virtualCurrency) {
                    marketDataMap.set(item.virtualCurrency, item);
                }
            });

            console.log(`🔍 Processing ${symbols.length} requested tokens...`);

            // Process each requested symbol
            for (const symbol of symbols) {
                try {
                    // Handle USDT_TRC20 as USDT
                    const searchSymbol = symbol === 'USDT_TRC20' ? 'USDT' : symbol;
                    const tokenData = marketDataMap.get(searchSymbol);

                    if (!tokenData) {
                        console.warn(`⚠️  Price not available for ${symbol}, skipping...`);
                        errors.push({ symbol, error: `Token ${symbol} not found in market data` });
                        continue;
                    }

                    // Try to get price from buy field first, then fall back to market field
                    const priceString = tokenData.buy || tokenData.market;
                    if (!priceString) {
                        console.warn(`⚠️  No price available for ${symbol}, skipping...`);
                        errors.push({ symbol, error: `No price available for ${symbol}` });
                        continue;
                    }

                    const priceINR = parseFloat(priceString);
                    if (isNaN(priceINR) || priceINR <= 0) {
                        console.warn(`⚠️  Invalid price for ${symbol}: ${priceString}, skipping...`);
                        errors.push({ symbol, error: `Invalid price for ${symbol}: ${priceString}` });
                        continue;
                    }

                    const priceUSD = priceINR * usdRate;

                    results.push({
                        symbol,
                        priceINR,
                        priceUSD: Math.round(priceUSD * 100000000) / 100000000, // Round to 8 decimal places
                        timestamp: new Date()
                    });

                    const priceSource = tokenData.buy ? 'buy' : 'market';
                    console.log(`✅ ${symbol}: ₹${priceINR.toLocaleString('en-IN')} ($${priceUSD.toFixed(6)}) [${priceSource}]`);

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`❌ Error processing ${symbol}:`, errorMessage);
                    errors.push({ symbol, error: errorMessage });
                }
            }

            console.log(`✅ Successfully processed ${results.length}/${symbols.length} tokens`);

            if (errors.length > 0) {
                console.warn(`⚠️  Failed to process ${errors.length} tokens:`);
                errors.forEach(({ symbol, error }) => {
                    console.warn(`   - ${symbol}: ${error}`);
                });
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Failed to fetch market data:', errorMessage);
            throw new Error(`Failed to fetch market data: ${errorMessage}`);
        }

        return results;
    }

    async validateApiConnection(): Promise<ValidationResult> {
        const result: ValidationResult = {
            success: false,
            method: 'primary',
            testedTokens: [],
            errors: []
        };

        const validationConfig = this.config.validation || {
            primaryToken: 'BTC',
            fallbackTokens: ['ETH', 'USDT', 'TRX'],
            maxRetries: 2,
            retryDelay: 1000,
            timeout: 5000
        };

        // Step 1: Try primary token
        try {
            const primarySuccess = await this.validateWithToken(validationConfig.primaryToken);
            if (primarySuccess) {
                result.success = true;
                result.method = 'primary';
                result.testedTokens = [validationConfig.primaryToken];
                return result;
            }
        } catch (error) {
            const apiError = this.categorizeValidationError(error, validationConfig.primaryToken, 1);
            result.errors.push({
                token: validationConfig.primaryToken,
                error: apiError.message,
                statusCode: apiError.statusCode,
                timestamp: new Date()
            });
        }

        // Step 2: Try fallback tokens
        for (const token of validationConfig.fallbackTokens) {
            try {
                const success = await this.validateWithToken(token);
                if (success) {
                    result.success = true;
                    result.method = 'fallback';
                    result.testedTokens.push(token);
                    result.warnings = [
                        `Primary validation token ${validationConfig.primaryToken} failed, but ${token} succeeded`
                    ];
                    return result;
                }
            } catch (error) {
                const apiError = this.categorizeValidationError(error, token, 1);
                result.errors.push({
                    token: token,
                    error: apiError.message,
                    statusCode: apiError.statusCode,
                    timestamp: new Date()
                });
                result.testedTokens.push(token);
            }
        }

        // Step 3: Basic health check
        try {
            const healthOk = await this.performBasicHealthCheck();
            if (healthOk) {
                result.success = true;
                result.method = 'health-check';
                result.warnings = ['Token validation failed but API appears to be accessible'];
                return result;
            }
        } catch (error) {
            result.errors.push({
                token: 'health-check',
                error: error instanceof Error ? error.message : String(error),
                timestamp: new Date()
            });
        }

        return result;
    }

    private async validateWithToken(symbol: string): Promise<boolean> {
        try {
            await this.fetchTokenPrice(symbol);
            return true;
        } catch (error) {
            return false;
        }
    }

    private async performBasicHealthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/market');
            return response.status === 200 && Array.isArray(response.data) && response.data.length > 0;
        } catch (error) {
            return false;
        }
    }

    private async getUsdExchangeRate(): Promise<number> {
        // Cache exchange rate for 1 hour to avoid excessive API calls
        const cacheValidityMs = 60 * 60 * 1000; // 1 hour
        const now = new Date();

        if (this.cachedUsdRate && this.rateLastFetched &&
            (now.getTime() - this.rateLastFetched.getTime()) < cacheValidityMs) {
            return this.cachedUsdRate;
        }

        try {
            const response = await this.exchangeRateClient.get('/latest/INR');
            const data: ExchangeRateResponse = response.data;

            if (!data.rates || !data.rates.USD) {
                throw new Error('Invalid exchange rate response');
            }

            this.cachedUsdRate = data.rates.USD;
            this.rateLastFetched = now;

            return this.cachedUsdRate;
        } catch (error) {
            console.warn('Failed to fetch USD exchange rate, using fallback rate:', error instanceof Error ? error.message : String(error));
            // Fallback to approximate rate (1 USD = 84 INR as of 2024)
            const fallbackRate = 0.012; // 1 INR = 0.012 USD approximately
            this.cachedUsdRate = fallbackRate;
            this.rateLastFetched = now;
            return fallbackRate;
        }
    }



    private categorizeValidationError(error: any, token: string, attempt: number): ApiError {
        const baseContext = {
            attempt,
            timestamp: new Date(),
            endpoint: '/market'
        };

        if (error.response) {
            const statusCode = error.response.status;

            if (statusCode === 404) {
                // Check if it's actually a token not found or API endpoint issue
                const responseText = error.response.data?.message || '';
                if (responseText.includes('not found') || responseText.includes('invalid symbol')) {
                    return this.createEnhancedApiError('TOKEN_NOT_FOUND', `Token ${token} not available on ZebPay`, statusCode, token, true, baseContext);
                } else {
                    return this.createEnhancedApiError('API_ERROR', `API endpoint not found (possible API change)`, statusCode, token, false, baseContext);
                }
            } else if (statusCode === 429) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
                const apiError = this.createEnhancedApiError('RATE_LIMIT', `Rate limit exceeded for ${token}`, statusCode, token, true, baseContext);
                apiError.retryAfter = retryAfter;
                return apiError;
            } else if (statusCode >= 500) {
                return this.createEnhancedApiError('API_ERROR', `ZebPay server error for ${token}`, statusCode, token, true, baseContext);
            } else {
                return this.createEnhancedApiError('API_ERROR', `API error for ${token}: ${statusCode}`, statusCode, token, false, baseContext);
            }
        } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return this.createEnhancedApiError('TIMEOUT', `Timeout while validating ${token}`, undefined, token, true, baseContext);
        } else if (error.type && ['TOKEN_NOT_FOUND', 'INVALID_RESPONSE'].includes(error.type)) {
            // Pass through our own errors with enhanced context
            return this.createEnhancedApiError(error.type, error.message, error.statusCode, token, false, baseContext);
        } else {
            return this.createEnhancedApiError('NETWORK_ERROR', `Network error while validating ${token}: ${error.message}`, undefined, token, true, baseContext);
        }
    }

    private isRetryableError(error: ApiError): boolean {
        return error.retryable && ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR', 'API_ERROR'].includes(error.type);
    }



    private createEnhancedApiError(
        type: ApiError['type'],
        message: string,
        statusCode: number | undefined,
        token: string,
        retryable: boolean,
        context: { attempt: number; timestamp: Date; endpoint: string }
    ): ApiError {
        const error = new Error(message) as ApiError;
        error.type = type;
        error.statusCode = statusCode;
        error.token = token;
        error.retryable = retryable;
        error.context = context;
        return error;
    }

    private createApiError(
        type: ApiError['type'],
        message: string,
        statusCode?: number,
        attempt?: number,
        retryAfter?: number
    ): ApiError {
        const error = new Error(message) as ApiError;
        error.type = type;
        error.statusCode = statusCode;
        error.attempt = attempt;
        error.retryAfter = retryAfter;
        error.retryable = ['RATE_LIMIT', 'TIMEOUT', 'NETWORK_ERROR'].includes(type);
        error.context = {
            attempt: attempt || 1,
            timestamp: new Date(),
            endpoint: '/market'
        };
        return error;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}