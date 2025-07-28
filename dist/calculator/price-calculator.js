"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceCalculator = void 0;
class PriceCalculator {
    calculateWithdrawalFeesInr(nativeFee, tokenPriceINR) {
        if (nativeFee <= 0 || tokenPriceINR <= 0) {
            throw new Error('Native fee and token price must be positive numbers');
        }
        return Math.round((nativeFee * tokenPriceINR) * 100) / 100; // Round to 2 decimal places
    }
    calculateWithdrawalFeesUsd(nativeFee, tokenPriceUSD) {
        if (nativeFee <= 0 || tokenPriceUSD <= 0) {
            throw new Error('Native fee and token price must be positive numbers');
        }
        return Math.round((nativeFee * tokenPriceUSD) * 100000000) / 100000000; // Round to 8 decimal places for USD
    }
    async processTokenData(tokenConfigs, tokenPrices) {
        const processedTokens = [];
        const priceMap = new Map();
        // Create a map for quick price lookups
        tokenPrices.forEach(price => {
            priceMap.set(price.symbol, price);
        });
        // Process each token configuration
        for (const [symbol, config] of Object.entries(tokenConfigs)) {
            try {
                const tokenPrice = priceMap.get(symbol);
                if (!tokenPrice) {
                    console.warn(`Price not available for ${symbol}, skipping...`);
                    continue;
                }
                const withdrawalFeeINR = this.calculateWithdrawalFeesInr(config.withdrawalFee, tokenPrice.priceINR);
                const withdrawalFeeUSD = this.calculateWithdrawalFeesUsd(config.withdrawalFee, tokenPrice.priceUSD);
                const processedToken = {
                    name: config.name,
                    symbol: config.symbol,
                    priceINR: tokenPrice.priceINR,
                    priceUSD: tokenPrice.priceUSD,
                    withdrawalFeeNative: config.withdrawalFee,
                    withdrawalFeeINR: withdrawalFeeINR,
                    withdrawalFeeUSD: withdrawalFeeUSD
                };
                processedTokens.push(processedToken);
            }
            catch (error) {
                console.error(`Error processing token ${symbol}:`, error instanceof Error ? error.message : String(error));
            }
        }
        // Sort by INR withdrawal fees (lowest to highest)
        return processedTokens.sort((a, b) => a.withdrawalFeeINR - b.withdrawalFeeINR);
    }
    validateTokenConfig(config) {
        if (!config.name || !config.symbol || typeof config.withdrawalFee !== 'number') {
            return false;
        }
        if (config.withdrawalFee < 0) {
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
    formatCurrencyINR(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    formatCurrencyUSD(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(amount);
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
}
exports.PriceCalculator = PriceCalculator;
//# sourceMappingURL=price-calculator.js.map