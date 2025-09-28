import { ZebPayClient } from '../api/zebpay-client'
import { PriceCalculator } from '../calculator/price-calculator'

interface AppConfig {
    tokens: Record<string, {
        name: string;
        symbol: string;
        withdrawalFee: number;
    }>;
    api: {
        baseUrl: string;
        timeout: number;
        retryAttempts: number;
        retryDelay: number;
        validation: {
            primaryToken: string;
            fallbackTokens: string[];
            maxRetries: number;
            retryDelay: number;
            timeout: number;
        };
    };
}

export class PriceService {
    private static config: AppConfig | null = null;

    private static async loadConfig(): Promise<AppConfig> {
        if (this.config) return this.config;

        try {
            // Determine the base path dynamically
            let basePath = '';
            if (typeof window !== 'undefined') {
                const pathname = window.location.pathname;
                // If we're on GitHub Pages, extract the repo name from the path
                if (pathname.startsWith('/zebpay-withdrawl-fees')) {
                    basePath = '/zebpay-withdrawl-fees';
                }
            }

            // For client-side, we'll need to fetch the config from a static file
            const configUrl = `${basePath}/config/tokens.json`;
            const response = await fetch(configUrl);
            if (!response.ok) {
                throw new Error(`Failed to load configuration from ${configUrl}`);
            }
            const config: AppConfig = await response.json();
            this.config = config;
            return config;
        } catch (error) {
            console.error('Failed to load config:', error);
            throw error;
        }
    }

    static async fetchPrices() {
        try {
            const config = await this.loadConfig();

            // Initialize clients
            const zebPayClient = new ZebPayClient(config.api);
            const calculator = new PriceCalculator();

            // Get token symbols
            const tokenSymbols = Object.keys(config.tokens);

            // Fetch prices
            const tokenPrices = await zebPayClient.fetchMultipleTokenPrices(tokenSymbols);

            // Process token data
            const processedTokens = await calculator.processTokenData(
                config.tokens,
                tokenPrices
            );

            return {
                tokens: processedTokens,
                lastUpdated: new Date().toISOString(),
                success: true
            };
        } catch (error) {
            console.error('Price Service Error:', error);
            throw error;
        }
    }
}