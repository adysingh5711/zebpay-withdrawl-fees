"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoPriceTracker = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path = __importStar(require("path"));
const zebpay_client_1 = require("./api/zebpay-client");
const price_calculator_1 = require("./calculator/price-calculator");
const table_generator_1 = require("./table/table-generator");
const readme_updater_1 = require("./updater/readme-updater");
class CryptoPriceTracker {
    constructor() {
        this.calculator = new price_calculator_1.PriceCalculator();
        this.tableGenerator = new table_generator_1.TableGenerator();
        this.readmeUpdater = new readme_updater_1.ReadmeUpdater();
    }
    async initialize() {
        try {
            console.log('🚀 Initializing Crypto Price Tracker...');
            // Load configuration
            await this.loadConfiguration();
            // Initialize API client
            this.zebPayClient = new zebpay_client_1.ZebPayClient(this.config.api);
            // Validate configuration
            await this.validateConfiguration();
            console.log('✅ Initialization complete');
        }
        catch (error) {
            console.error('❌ Initialization failed:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
    async run() {
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
            }
            else {
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
            const processedTokens = await this.calculator.processTokenData(this.config.tokens, tokenPrices);
            console.log(`✅ Successfully processed ${processedTokens.length} tokens with complete data`);
            // Generate table
            console.log('📋 Generating sortable table...');
            const tableHtml = this.tableGenerator.generateSortableTable(processedTokens, new Date());
            // Update README
            console.log('📝 Updating README.md...');
            await this.readmeUpdater.updatePriceTable(tableHtml);
            // Log success with detailed statistics
            const updateMessage = successCount === tokenSymbols.length
                ? `Successfully updated ${processedTokens.length} tokens`
                : `Successfully updated ${processedTokens.length} tokens (${failedCount} tokens unavailable on ZebPay)`;
            await this.readmeUpdater.addUpdateLog(updateMessage);
            console.log('🎉 Price update completed successfully!');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Price update failed:', errorMessage);
            // Log error
            await this.readmeUpdater.addUpdateLog(`Update failed: ${errorMessage}`);
            throw error;
        }
        finally {
            // Cleanup
            await this.readmeUpdater.cleanupBackup();
        }
    }
    async loadConfiguration() {
        const configPath = path.join(process.cwd(), 'src', 'config', 'tokens.json');
        if (!(await fs_extra_1.default.pathExists(configPath))) {
            throw new Error(`Configuration file not found: ${configPath}`);
        }
        try {
            const configData = await fs_extra_1.default.readFile(configPath, 'utf8');
            this.config = JSON.parse(configData);
            console.log(`✅ Configuration loaded: ${Object.keys(this.config.tokens).length} tokens configured`);
        }
        catch (error) {
            throw new Error(`Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async validateConfiguration() {
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
    async getStatus() {
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
exports.CryptoPriceTracker = CryptoPriceTracker;
// Main execution
async function main() {
    const tracker = new CryptoPriceTracker();
    try {
        await tracker.initialize();
        await tracker.run();
        process.exit(0);
    }
    catch (error) {
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
}
else {
    // Normal execution
    main();
}
//# sourceMappingURL=main.js.map