"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZebPayClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ZebPayClient {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: config.baseUrl,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'crypto-price-tracker/1.0.0'
            }
        });
    }
    async fetchTokenPrice(symbol) {
        const market = `${symbol}INR`;
        let lastError;
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const response = await this.client.get(`/ticker/${market}`);
                if (!response.data || !response.data.buy) {
                    throw this.createApiError('INVALID_RESPONSE', `Invalid response for ${symbol}`, 0, attempt);
                }
                const price = parseFloat(response.data.buy);
                if (isNaN(price) || price <= 0) {
                    throw this.createApiError('INVALID_RESPONSE', `Invalid price for ${symbol}: ${response.data.buy}`, 0, attempt);
                }
                return {
                    symbol,
                    price,
                    currency: 'INR',
                    timestamp: new Date()
                };
            }
            catch (error) {
                lastError = this.handleApiError(error, symbol, attempt);
                if (attempt < this.config.retryAttempts) {
                    const delay = this.config.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`Retrying ${symbol} in ${delay}ms (attempt ${attempt + 1}/${this.config.retryAttempts})`);
                    await this.sleep(delay);
                }
            }
        }
        throw lastError;
    }
    async fetchMultipleTokenPrices(symbols) {
        const results = [];
        const errors = [];
        // Process tokens in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < symbols.length; i += batchSize) {
            const batch = symbols.slice(i, i + batchSize);
            const batchPromises = batch.map(async (symbol) => {
                try {
                    const price = await this.fetchTokenPrice(symbol);
                    results.push(price);
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.error(`Failed to fetch price for ${symbol}:`, errorMessage);
                    errors.push({ symbol, error: errorMessage });
                }
            });
            await Promise.all(batchPromises);
            // Add delay between batches to respect rate limits
            if (i + batchSize < symbols.length) {
                await this.sleep(1000);
            }
        }
        if (errors.length > 0) {
            console.warn(`Failed to fetch prices for ${errors.length} tokens:`, errors);
        }
        return results;
    }
    async validateApiConnection() {
        try {
            // Test with a common token like BTC
            await this.fetchTokenPrice('BTC');
            return true;
        }
        catch (error) {
            console.error('API connection validation failed:', error instanceof Error ? error.message : String(error));
            return false;
        }
    }
    handleApiError(error, symbol, attempt) {
        if (error.response) {
            const statusCode = error.response.status;
            if (statusCode === 429) {
                const retryAfter = parseInt(error.response.headers['retry-after'] || '60');
                return this.createApiError('RATE_LIMIT', `Rate limit exceeded for ${symbol}`, statusCode, attempt, retryAfter);
            }
            if (statusCode >= 500) {
                return this.createApiError('API_ERROR', `Server error for ${symbol}: ${statusCode}`, statusCode, attempt);
            }
            if (statusCode === 404) {
                return this.createApiError('INVALID_RESPONSE', `Token ${symbol} not found on ZebPay`, statusCode, attempt);
            }
            return this.createApiError('API_ERROR', `API error for ${symbol}: ${statusCode}`, statusCode, attempt);
        }
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return this.createApiError('NETWORK_ERROR', `Timeout for ${symbol}`, 0, attempt);
        }
        return this.createApiError('NETWORK_ERROR', `Network error for ${symbol}: ${error.message}`, 0, attempt);
    }
    createApiError(type, message, statusCode, attempt, retryAfter) {
        const error = new Error(message);
        error.type = type;
        error.statusCode = statusCode;
        error.attempt = attempt;
        error.retryAfter = retryAfter;
        return error;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.ZebPayClient = ZebPayClient;
//# sourceMappingURL=zebpay-client.js.map