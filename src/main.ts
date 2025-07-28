import fs from 'fs-extra';
import * as path from 'path';
import { ZebPayClient } from './api/zebpay-client';
import { PriceCalculator } from './calculator/price-calculator';
import { TableGenerator } from './table/table-generator';
import { ReadmeUpdater } from './updater/readme-updater';
import { TokenConfig, ApiConfig } from './api/api-types';

interface AppConfig {
    tokens: Record<string, TokenConfig>;
    api: ApiConfig;
    table: {
        refreshButtonText: string;
        lastUpdatedFormat: string;
        tableId: string;
    };
}

class CryptoPriceTracker {
    private config!: AppConfig;
    private zebPayClient!: ZebPayClient;
    private calculator: PriceCalculator;
    private tableGenerator: TableGenerator;
    private readmeUpdater: ReadmeUpdater;

    constructor() {
        this.calculator = new PriceCalculator();
        this.tableGenerator = new TableGenerator();
        this.readmeUpdater = new ReadmeUpdater();
    }

    async initialize(): Promise<void> {
        try {
            console.log('🚀 Initializing Crypto Price Tracker...');

            // Load configuration
            await this.loadConfiguration();

            // Initialize API client
            this.zebPayClient = new ZebPayClient(this.config.api);

            // Validate configuration
            await this.validateConfiguration();

            console.log('✅ Initialization complete');

        } catch (error) {
            console.error('❌ Initialization failed:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async run(): Promise<void> {
        try {
            console.log('📊 Starting price update process...');

            // Validate API connection
            console.log('🔗 Validating API connection...');
            const validationResult = await this.zebPayClient.validateApiConnection();

            if (!validationResult.success) {
                console.error('❌ API connection validation failed:');
                validationResult.errors.forEach(error => {
                    console.error(`   ${error.token}: ${error.error}`);
                });
                throw new Error('Failed to connect to ZebPay API');
            }

            // Log validation success with method used
            if (validationResult.method === 'primary') {
                console.log('✅ API connection validated with primary token');
            } else {
                console.log(`✅ API connection validated using ${validationResult.method} method`);
                if (validationResult.warnings) {
                    validationResult.warnings.forEach(warning => {
                        console.warn(`⚠️  ${warning}`);
                    });
                }
            }

            // Get list of tokens to fetch
            const tokenSymbols = Object.keys(this.config.tokens);
            console.log(`📈 Attempting to fetch prices for ${tokenSymbols.length} configured tokens...`);
            console.log(`🔍 Tokens: ${tokenSymbols.join(', ')}`);

            // Fetch prices for all tokens
            const tokenPrices = await this.zebPayClient.fetchMultipleTokenPrices(tokenSymbols);

            const successCount = tokenPrices.length;
            const failedCount = tokenSymbols.length - successCount;

            console.log(`✅ Successfully fetched prices for ${successCount} tokens`);
            if (failedCount > 0) {
                console.log(`⚠️  Failed to fetch prices for ${failedCount} tokens (they may not be available on ZebPay)`);
            }

            if (tokenPrices.length === 0) {
                throw new Error('No token prices were fetched successfully. Please check if the tokens are available on ZebPay.');
            }

            // Process token data
            console.log('🧮 Processing token data and calculating withdrawal fees...');
            const processedTokens = await this.calculator.processTokenData(
                this.config.tokens,
                tokenPrices
            );
            console.log(`✅ Successfully processed ${processedTokens.length} tokens with complete data`);

            // Generate table
            console.log('📋 Generating sortable table...');
            const tableHtml = this.tableGenerator.generateSortableTable(
                processedTokens,
                new Date()
            );

            // Update README
            console.log('📝 Updating README.md...');
            await this.readmeUpdater.updatePriceTable(tableHtml);

            // Log success with detailed statistics
            const updateMessage = successCount === tokenSymbols.length
                ? `Successfully updated ${processedTokens.length} tokens`
                : `Successfully updated ${processedTokens.length} tokens (${failedCount} tokens unavailable on ZebPay)`;

            await this.readmeUpdater.addUpdateLog(updateMessage);

            console.log('🎉 Price update completed successfully!');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Price update failed:', errorMessage);

            // Log error
            await this.readmeUpdater.addUpdateLog(`Update failed: ${errorMessage}`);

            throw error;
        } finally {
            // Cleanup
            await this.readmeUpdater.cleanupBackup();
        }
    }

    private async loadConfiguration(): Promise<void> {
        const configPath = path.join(process.cwd(), 'src', 'config', 'tokens.json');

        if (!(await fs.pathExists(configPath))) {
            throw new Error(`Configuration file not found: ${configPath}`);
        }

        try {
            const configData = await fs.readFile(configPath, 'utf8');
            this.config = JSON.parse(configData);
            console.log(`✅ Configuration loaded: ${Object.keys(this.config.tokens).length} tokens configured`);
        } catch (error) {
            throw new Error(`Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async validateConfiguration(): Promise<void> {
        // Validate API configuration
        if (!this.config.api || !this.config.api.baseUrl) {
            throw new Error('Invalid API configuration');
        }

        // Validate token configurations
        const validation = this.calculator.validateTokenConfigs(this.config.tokens);

        if (validation.invalid.length > 0) {
            console.warn(`⚠️  Invalid token configurations: ${validation.invalid.join(', ')}`);
        }

        if (validation.valid.length === 0) {
            throw new Error('No valid token configurations found');
        }

        console.log(`✅ Configuration validated: ${validation.valid.length} valid tokens`);
    }

    async getStatus(): Promise<{
        lastUpdate: Date | null;
        totalTokens: number;
        validTokens: number;
        readmeExists: boolean;
    }> {
        const lastUpdate = await this.readmeUpdater.getLastUpdateTime();
        const validation = this.calculator.validateTokenConfigs(this.config.tokens);
        const readmeExists = await this.readmeUpdater.validateReadmeIntegrity();

        return {
            lastUpdate,
            totalTokens: Object.keys(this.config.tokens).length,
            validTokens: validation.valid.length,
            readmeExists
        };
    }
}

// Main execution
async function main() {
    const tracker = new CryptoPriceTracker();

    try {
        await tracker.initialize();
        await tracker.run();
        process.exit(0);
    } catch (error) {
        console.error('💥 Application failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--status')) {
    // Status check mode
    (async () => {
        const tracker = new CryptoPriceTracker();
        await tracker.initialize();
        const status = await tracker.getStatus();
        console.log('📊 Status:', JSON.stringify(status, null, 2));
    })();
} else {
    // Normal execution
    main();
}

export { CryptoPriceTracker };