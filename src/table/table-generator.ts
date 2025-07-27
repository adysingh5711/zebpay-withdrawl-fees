import { ProcessedToken } from '../api/api-types';
import { PriceCalculator } from '../calculator/price-calculator';

export class TableGenerator {
  private calculator: PriceCalculator;

  constructor() {
    this.calculator = new PriceCalculator();
  }

  generateSortableTable(tokens: ProcessedToken[], lastUpdated: Date): string {
    const tableHeader = this.createTableHeader();
    const tableRows = this.createTableRows(tokens);
    const sortingScript = this.addSortingScript();
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

<table id="crypto-price-table">
${tableHeader}
${tableRows}
</table>

${sortingScript}
<!-- CRYPTO PRICE TABLE END -->`;
  }

  private createTableHeader(): string {
    return `  <thead>
    <tr>
      <th onclick="sortTable(0)" style="cursor: pointer;">Token Name <span id="sort-0">⇅</span></th>
      <th onclick="sortTable(1)" style="cursor: pointer;">Symbol <span id="sort-1">⇅</span></th>
      <th onclick="sortTable(2)" style="cursor: pointer;">Price (INR) <span id="sort-2">⇅</span></th>
      <th onclick="sortTable(3)" style="cursor: pointer;">Price (USD) <span id="sort-3">⇅</span></th>
      <th onclick="sortTable(4)" style="cursor: pointer;">Withdrawal Fee (Native) <span id="sort-4">⇅</span></th>
      <th onclick="sortTable(5)" style="cursor: pointer;">Withdrawal Fee (INR) <span id="sort-5">⇅</span></th>
      <th onclick="sortTable(6)" style="cursor: pointer;">Withdrawal Fee (USD) <span id="sort-6">⇅</span></th>
    </tr>
  </thead>`;
  }

  private createTableRows(tokens: ProcessedToken[]): string {
    const rows = tokens.map(token => {
      return `    <tr>
      <td>${token.name}</td>
      <td><strong>${token.symbol}</strong></td>
      <td>₹${token.priceINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>$${token.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</td>
      <td>${this.calculator.formatTokenAmount(token.withdrawalFeeNative)}</td>
      <td>₹${token.withdrawalFeeINR.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>$${token.withdrawalFeeUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</td>
    </tr>`;
    }).join('\n');

    return `  <tbody>
${rows}
  </tbody>`;
  }

  private createSummary(tokens: ProcessedToken[]): string {
    return `
**Crypto Price Tracker Summary:**
- **Total Tokens Tracked:** ${tokens.length}
- **Data Source:** ZebPay API
- **Prices shown in:** INR and USD
- **Withdrawal fees calculated in:** Native token, INR, and USD
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

  private addSortingScript(): string {
    return `
<script>
let sortDirection = {};

function sortTable(columnIndex) {
  const table = document.getElementById('crypto-price-table');
  const tbody = table.getElementsByTagName('tbody')[0];
  const rows = Array.from(tbody.getElementsByTagName('tr'));
  
  // Determine sort direction
  const currentDirection = sortDirection[columnIndex] || 'asc';
  const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
  sortDirection[columnIndex] = newDirection;
  
  // Update sort indicators
  for (let i = 0; i < 7; i++) {
    const indicator = document.getElementById('sort-' + i);
    if (i === columnIndex) {
      indicator.textContent = newDirection === 'asc' ? '↑' : '↓';
    } else {
      indicator.textContent = '⇅';
    }
  }
  
  // Sort rows
  rows.sort((a, b) => {
    const aValue = getCellValue(a, columnIndex);
    const bValue = getCellValue(b, columnIndex);
    
    let comparison = 0;
    if (isNumeric(aValue) && isNumeric(bValue)) {
      comparison = parseFloat(aValue.replace(/[₹$,]/g, '')) - parseFloat(bValue.replace(/[₹$,]/g, ''));
    } else {
      comparison = aValue.localeCompare(bValue);
    }
    
    return newDirection === 'asc' ? comparison : -comparison;
  });
  
  // Reorder rows in table
  rows.forEach(row => tbody.appendChild(row));
}

function getCellValue(row, columnIndex) {
  return row.getElementsByTagName('td')[columnIndex].textContent.trim();
}

function isNumeric(str) {
  const numStr = str.replace(/[₹$,]/g, '');
  return !isNaN(numStr) && !isNaN(parseFloat(numStr));
}

// Initialize sort indicators
document.addEventListener('DOMContentLoaded', function() {
  // Set default sort by token name
  sortTable(0);
});
</script>

<style>
#crypto-price-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

#crypto-price-table th,
#crypto-price-table td {
  border: 1px solid #ddd;
  padding: 12px 8px;
  text-align: left;
}

#crypto-price-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  position: sticky;
  top: 0;
  user-select: none;
}

#crypto-price-table th:hover {
  background-color: #e8e8e8;
}

#crypto-price-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

#crypto-price-table tr:hover {
  background-color: #f5f5f5;
}

#crypto-price-table td:nth-child(3),
#crypto-price-table td:nth-child(4),
#crypto-price-table td:nth-child(6),
#crypto-price-table td:nth-child(7) {
  text-align: right;
  font-family: 'Courier New', monospace;
}

#crypto-price-table td:nth-child(5) {
  text-align: right;
}

@media (max-width: 768px) {
  #crypto-price-table {
    font-size: 12px;
  }
  
  #crypto-price-table th,
  #crypto-price-table td {
    padding: 6px 4px;
  }
}
</style>`;
  }
}