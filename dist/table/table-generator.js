"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableGenerator = void 0;
const price_calculator_1 = require("../calculator/price-calculator");
class TableGenerator {
    constructor() {
        this.calculator = new price_calculator_1.PriceCalculator();
    }
    generateSortableTable(tokens, lastUpdated) {
        const summary = this.createSummary(tokens);
        const refreshButton = this.createRefreshButton();
        return `
<!-- CRYPTO PRICE TABLE START -->
${refreshButton}

**Last Updated:** ${lastUpdated.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })} IST

${summary}

| Token Name | Symbol | Price (INR) | Price (USD) | Withdrawal Fee (Native) | Withdrawal Fee (INR) | Withdrawal Fee (USD) |
|------------|--------|-------------|-------------|-------------------------|---------------------|---------------------|
${this.createMarkdownTableRows(tokens)}

<!-- CRYPTO PRICE TABLE END -->`;
    }
    createMarkdownTableRows(tokens) {
        return tokens.map(token => {
            const priceINR = `₹${token.priceINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const priceUSD = `$${token.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
            const feeNative = this.calculator.formatTokenAmount(token.withdrawalFeeNative);
            const feeINR = `₹${token.withdrawalFeeINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const feeUSD = `$${token.withdrawalFeeUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
            return `| ${token.name} | **${token.symbol}** | ${priceINR} | ${priceUSD} | ${feeNative} | ${feeINR} | ${feeUSD} |`;
        }).join('\n');
    }
    createSummary(tokens) {
        return `
**Crypto Price Tracker Summary:**
- **Total Tokens Processed:** ${tokens.length}
- **Data Source:** ZebPay API (Real-time market data)
- **Prices shown in:** INR and USD
- **Withdrawal fees calculated in:** Native token, INR, and USD
- **Table sorted by:** Withdrawal fees in INR (lowest to highest)
- **Note:** Tokens not available on ZebPay are automatically skipped
`;
    }
    createRefreshButton() {
        return `
<div align="center">
  <a href="https://github.com/${process.env.GITHUB_REPOSITORY || 'your-username/your-repo'}/actions/workflows/update-prices.yml">
    <img src="https://img.shields.io/badge/🔄-Refresh%20Prices-blue?style=for-the-badge" alt="Refresh Prices" />
  </a>
</div>
`;
    }
}
exports.TableGenerator = TableGenerator;
//# sourceMappingURL=table-generator.js.map