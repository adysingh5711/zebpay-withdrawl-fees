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
            const isConnected = await this.zebPayClient.validateApiConnection();
            if (!isConnected) {
                throw new Error('Failed to connect to ZebPay API');
            }
            console.log('✅ API connection validated');

            // Get list of tokens to fetch
            const tokenSymbols = Object.keys(this.config.tokens);
            console.log(`📈 Fetching prices for ${tokenSymbols.length} tokens...`);

            // Fetch prices for all tokens
            const tokenPrices = await this.zebPayClient.fetchMultipleTokenPrices(tokenSymbols);
            console.log(`✅ Successfully fetched ${tokenPrices.length} prices`);

            if (tokenPrices.length === 0) {
                throw new Error('No token prices were fetched successfully');
            }

            // Process token data
            console.log('🧮 Processing token data...');
            const processedTokens = await this.calculator.processTokenData(
                this.config.tokens,
                tokenPrices
            );
            console.log(`✅ Processed ${processedTokens.length} tokens`);

            // Generate table
            console.log('📋 Generating sortable table...');
            const tableHtml = this.tableGenerator.generateSortableTable(
                processedTokens,
                new Date()
            );

            // Update README
            console.log('📝 Updating README.md...');
            await this.readmeUpdater.updatePriceTable(tableHtml);

            // Log success
            await this.readmeUpdater.addUpdateLog(
                `Successfully updated ${processedTokens.length} tokens`
            );

            // Calculate and display summary
            const summary = this.calculator.calculateTotalPortfolioValue(processedTokens);
            console.log('💰 Portfolio Summary:');
            console.log(`   Total Value: ₹${summary.totalValue.toLocaleString('en-IN')}`);
            console.log(`   Total Fees: ₹${summary.totalWithdrawalFees.toLocaleString('en-IN')}`);
            console.log(`   Net Value: ₹${summary.netValue.toLocaleString('en-IN')}`);

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