"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceCalculator = void 0;
class PriceCalculator {
    calculateInrValue(tokenAmount, price) {
        if (tokenAmount <= 0 || price <= 0) {
            throw new Error('Token amount and price must be positive numbers');
        }
        return Math.round((tokenAmount * price) * 100) / 100; // Round to 2 decimal places
    }
    calculateWithdrawalFeesInr(nativeFee, tokenPrice) {
        if (nativeFee <= 0 || tokenPrice <= 0) {
            throw new Error('Native fee and token price must be positive numbers');
        }
        return Math.round((nativeFee * tokenPrice) * 100) / 100; // Round to 2 decimal places
    }
    async processTokenData(tokenConfigs, tokenPrices) {
        const processedTokens = [];
        const priceMap = new Map();
        // Create a map for quick price lookups
        tokenPrices.forEach(price => {
            priceMap.set(price.symbol, price.price);
        });
        // Process each token configuration
        for (const [symbol, config] of Object.entries(tokenConfigs)) {
            try {
                const price = priceMap.get(symbol);
                if (!price) {
                    console.warn(`Price not available for ${symbol}, skipping...`);
                    continue;
                }
                const inrValue = this.calculateInrValue(config.amount, price);
                const withdrawalFeeInr = this.calculateWithdrawalFeesInr(config.withdrawalFee, price);
                const processedToken = {
                    name: config.name,
                    symbol: config.symbol,
                    price: price,
                    amount: config.amount,
                    inrValue: inrValue,
                    withdrawalFeeNative: config.withdrawalFee,
                    withdrawalFeeInr: withdrawalFeeInr
                };
                processedTokens.push(processedToken);
            }
            catch (error) {
                console.error(`Error processing token ${symbol}:`, error instanceof Error ? error.message : String(error));
            }
        }
        // Sort by symbol for consistent output
        return processedTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
    validateTokenConfig(config) {
        if (!config.name || !config.symbol || typeof config.withdrawalFee !== 'number' || typeof config.amount !== 'number') {
            return false;
        }
        if (config.withdrawalFee < 0 || config.amount <= 0) {
            return false;
        }
        return true;
    }
    validateTokenConfigs(configs) {
        const valid = [];
        const invalid = [];
        for (const [symbol, config] of Object.entries(configs)) {
            if (this.validateTokenConfig(config)) {
                valid.push(config);
            }
            else {
                invalid.push(symbol);
                console.warn(`Invalid token configuration for ${symbol}:`, config);
            }
        }
        return { valid, invalid };
    }
    formatCurrency(amount, currency = 'INR') {
        if (currency === 'INR') {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        }
        return amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        });
    }
    formatTokenAmount(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(2) + 'M';
        }
        else if (amount >= 1000) {
            return (amount / 1000).toFixed(2) + 'K';
        }
        else if (amount < 1) {
            return amount.toFixed(8);
        }
        else {
            return amount.toFixed(2);
        }
    }
    calculateTotalPortfolioValue(processedTokens) {
        const totalValue = processedTokens.reduce((sum, token) => sum + token.inrValue, 0);
        const totalWithdrawalFees = processedTokens.reduce((sum, token) => sum + token.withdrawalFeeInr, 0);
        const netValue = totalValue - totalWithdrawalFees;
        return {
            totalValue: Math.round(totalValue * 100) / 100,
            totalWithdrawalFees: Math.round(totalWithdrawalFees * 100) / 100,
            netValue: Math.round(netValue * 100) / 100
        };
    }
}
exports.PriceCalculator = PriceCalculator;
//# sourceMappingURL=price-calculator.js.map