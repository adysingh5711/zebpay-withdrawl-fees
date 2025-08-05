import { ProcessedToken } from '../api/api-types';
import { PriceCalculator } from '../calculator/price-calculator';

export class TableGenerator {
  private calculator: PriceCalculator;

  constructor() {
    this.calculator = new PriceCalculator();
  }

  generateSortableTable(tokens: ProcessedToken[], lastUpdated: Date): string {
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

<div align="center">

| Token Name | Symbol | Price (INR) | Price (USD) | Withdrawal Fee (Native) | Withdrawal Fee (INR) | Withdrawal Fee (USD) |
|:-----------|:------:|------------:|------------:|------------------------:|--------------------:|--------------------:|
${this.createMarkdownTableRows(tokens)}

</div>

<!-- CRYPTO PRICE TABLE END -->`;
  }

  private createMarkdownTableRows(tokens: ProcessedToken[]): string {
    return tokens.map(token => {
      const priceINR = `₹${token.priceINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
      const priceUSD = `$${token.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
      const feeNative = this.calculator.formatTokenAmount(token.withdrawalFeeNative);
      const feeINR = `₹${token.withdrawalFeeINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
      const feeUSD = `$${token.withdrawalFeeUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;

      return `| ${token.name} | **${token.symbol}** | ${priceINR} | ${priceUSD} | ${feeNative} | ${feeINR} | ${feeUSD} |`;
    }).join('\n');
  }

  private createSummary(tokens: ProcessedToken[]): string {
    return `
**Crypto Price Tracker Summary:**
- **Total Tokens Processed:** ${tokens.length}
- **Data Source:** ZebPay API (Real-time market data)
- **Prices shown in:** INR and USD
- **Withdrawal fees calculated in:** Native token, INR, and USD
- **Table sorted by:** Withdrawal fees in INR (lowest to highest)
- **Note:** Tokens not available on ZebPay are automatically skipped. Apart from these fees, ZebPay charges a flat ₹15 on each withdrawal.
`;
  }

  private createRefreshButton(): string {
    return `
<div align="center">
  <a href="https://github.com/${process.env.GITHUB_REPOSITORY || 'your-username/your-repo'}/actions/workflows/update-prices.yml">
    <img src="https://img.shields.io/badge/🔄-Refresh%20Prices-blue?style=for-the-badge" alt="Refresh Prices" />
  </a>
</div>
`;
  }
}