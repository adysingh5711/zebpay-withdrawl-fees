# 🚀 Crypto Portfolio Tracker

A comprehensive cryptocurrency portfolio tracker that fetches real-time INR prices from ZebPay API and displays your token holdings with withdrawal fees in a beautiful, sortable table format.

## 📊 Zebpay Withdrawl Fees


<!-- CRYPTO PRICE TABLE START -->

<div align="center">
  <a href="https://github.com/adysingh5711/zebpay-withdraw-fees/actions/workflows/update-prices.yml">
    <img src="https://img.shields.io/badge/🔄-Refresh%20Prices-blue?style=for-the-badge" alt="Refresh Prices" />
  </a>
</div>


**Last Updated:** 27/07/2025, 08:51:42 pm IST


**Crypto Price Tracker Summary:**
- **Total Tokens Tracked:** 54
- **Data Source:** ZebPay API
- **Prices shown in:** INR and USD
- **Withdrawal fees calculated in:** Native token, INR, and USD


<table id="crypto-price-table">
  <thead>
    <tr>
      <th onclick="sortTable(0)" style="cursor: pointer;">Token Name <span id="sort-0">⇅</span></th>
      <th onclick="sortTable(1)" style="cursor: pointer;">Symbol <span id="sort-1">⇅</span></th>
      <th onclick="sortTable(2)" style="cursor: pointer;">Price (INR) <span id="sort-2">⇅</span></th>
      <th onclick="sortTable(3)" style="cursor: pointer;">Price (USD) <span id="sort-3">⇅</span></th>
      <th onclick="sortTable(4)" style="cursor: pointer;">Withdrawal Fee (Native) <span id="sort-4">⇅</span></th>
      <th onclick="sortTable(5)" style="cursor: pointer;">Withdrawal Fee (INR) <span id="sort-5">⇅</span></th>
      <th onclick="sortTable(6)" style="cursor: pointer;">Withdrawal Fee (USD) <span id="sort-6">⇅</span></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1inch</td>
      <td><strong>1INCH</strong></td>
      <td>₹24.77</td>
      <td>$2,135.61465517</td>
      <td>11.20</td>
      <td>₹277.57</td>
      <td>$23,928.45551431</td>
    </tr>
    <tr>
      <td>Aave</td>
      <td><strong>AAVE</strong></td>
      <td>₹26,181.45</td>
      <td>$2,257,021.97068966</td>
      <td>0.00740329</td>
      <td>₹193.83</td>
      <td>$16,709.38818539</td>
    </tr>
    <tr>
      <td>Alchemy Pay</td>
      <td><strong>ACH</strong></td>
      <td>₹2.04</td>
      <td>$175.4987931</td>
      <td>108.05</td>
      <td>₹219.97</td>
      <td>$18,962.59244674</td>
    </tr>
    <tr>
      <td>Cardano</td>
      <td><strong>ADA</strong></td>
      <td>₹72.92</td>
      <td>$6,286.1462931</td>
      <td>1.78</td>
      <td>₹129.47</td>
      <td>$11,161.48133285</td>
    </tr>
    <tr>
      <td>Adventure Gold</td>
      <td><strong>AGLD</strong></td>
      <td>₹70.66</td>
      <td>$6,091.62327586</td>
      <td>2.90</td>
      <td>₹205.00</td>
      <td>$17,672.24624842</td>
    </tr>
    <tr>
      <td>Arbitrum</td>
      <td><strong>ARB</strong></td>
      <td>₹43.90</td>
      <td>$3,784.48275862</td>
      <td>5.59</td>
      <td>₹245.39</td>
      <td>$21,154.17974034</td>
    </tr>
    <tr>
      <td>Cosmos</td>
      <td><strong>ATOM</strong></td>
      <td>₹425.43</td>
      <td>$36,674.95025862</td>
      <td>0.10000000</td>
      <td>₹42.54</td>
      <td>$3,667.49502586</td>
    </tr>
    <tr>
      <td>Avalanche</td>
      <td><strong>AVAX</strong></td>
      <td>₹2,223.86</td>
      <td>$191,711.71336207</td>
      <td>0.05530973</td>
      <td>₹123.00</td>
      <td>$10,603.52310389</td>
    </tr>
    <tr>
      <td>Axie Infinity</td>
      <td><strong>AXS</strong></td>
      <td>₹231.03</td>
      <td>$19,916.37931034</td>
      <td>0.88888889</td>
      <td>₹205.36</td>
      <td>$17,703.44829799</td>
    </tr>
    <tr>
      <td>Basic Attention Token</td>
      <td><strong>BAT</strong></td>
      <td>₹14.77</td>
      <td>$1,273.27586207</td>
      <td>15.60</td>
      <td>₹230.42</td>
      <td>$19,863.8979979</td>
    </tr>
    <tr>
      <td>Bitcoin Cash</td>
      <td><strong>BCH</strong></td>
      <td>₹52,851.99</td>
      <td>$4,556,206.03448276</td>
      <td>0.00400000</td>
      <td>₹211.41</td>
      <td>$18,224.82413793</td>
    </tr>
    <tr>
      <td>BNB</td>
      <td><strong>BNB</strong></td>
      <td>₹69,980.00</td>
      <td>$6,032,758.62068966</td>
      <td>0.00153346</td>
      <td>₹107.31</td>
      <td>$9,250.99403448</td>
    </tr>
    <tr>
      <td>Bitcoin</td>
      <td><strong>BTC</strong></td>
      <td>₹1,04,20,000.00</td>
      <td>$898,275,862.0689656</td>
      <td>0.00040000</td>
      <td>₹4,168.00</td>
      <td>$359,310.34482759</td>
    </tr>
    <tr>
      <td>PancakeSwap</td>
      <td><strong>CAKE</strong></td>
      <td>₹251.16</td>
      <td>$21,651.41465517</td>
      <td>0.43668122</td>
      <td>₹109.68</td>
      <td>$9,454.76616635</td>
    </tr>
    <tr>
      <td>Celer Network</td>
      <td><strong>CELR</strong></td>
      <td>₹0.74</td>
      <td>$63.62827586</td>
      <td>270.53</td>
      <td>₹199.67</td>
      <td>$17,213.11398908</td>
    </tr>
    <tr>
      <td>Compound</td>
      <td><strong>COMP</strong></td>
      <td>₹4,528.82</td>
      <td>$390,415.71767241</td>
      <td>0.04481291</td>
      <td>₹202.95</td>
      <td>$17,495.66441864</td>
    </tr>
    <tr>
      <td>Dogecoin</td>
      <td><strong>DOGE</strong></td>
      <td>₹22.00</td>
      <td>$1,896.55172414</td>
      <td>6.07</td>
      <td>₹133.58</td>
      <td>$11,515.18958967</td>
    </tr>
    <tr>
      <td>Polkadot</td>
      <td><strong>DOT</strong></td>
      <td>₹369.54</td>
      <td>$31,856.89655172</td>
      <td>0.29325513</td>
      <td>₹108.37</td>
      <td>$9,342.19833967</td>
    </tr>
    <tr>
      <td>Enjin Coin</td>
      <td><strong>ENJ</strong></td>
      <td>₹7.30</td>
      <td>$629.31034483</td>
      <td>30.24</td>
      <td>₹220.74</td>
      <td>$19,029.6445374</td>
    </tr>
    <tr>
      <td>Ethereum Name Service</td>
      <td><strong>ENS</strong></td>
      <td>₹2,858.00</td>
      <td>$246,379.31034483</td>
      <td>0.10683761</td>
      <td>₹305.34</td>
      <td>$26,322.57667069</td>
    </tr>
    <tr>
      <td>Ethereum</td>
      <td><strong>ETH</strong></td>
      <td>₹3,35,000.00</td>
      <td>$28,879,310.34482759</td>
      <td>0.00081505</td>
      <td>₹273.04</td>
      <td>$23,538.08189655</td>
    </tr>
    <tr>
      <td>Harvest Finance</td>
      <td><strong>FARM</strong></td>
      <td>₹2,600.00</td>
      <td>$224,137.93103448</td>
      <td>0.07846214</td>
      <td>₹204.00</td>
      <td>$17,586.34172414</td>
    </tr>
    <tr>
      <td>FLOKI</td>
      <td><strong>FLOKI</strong></td>
      <td>₹0.01</td>
      <td>$0.99905172</td>
      <td>13.14K</td>
      <td>₹152.23</td>
      <td>$13,122.97018258</td>
    </tr>
    <tr>
      <td>The Graph</td>
      <td><strong>GRT</strong></td>
      <td>₹9.60</td>
      <td>$827.59913793</td>
      <td>23.71</td>
      <td>₹227.57</td>
      <td>$19,618.32731776</td>
    </tr>
    <tr>
      <td>Injective</td>
      <td><strong>INJ</strong></td>
      <td>₹1,349.91</td>
      <td>$116,371.55172414</td>
      <td>0.09140768</td>
      <td>₹123.39</td>
      <td>$10,637.2535611</td>
    </tr>
    <tr>
      <td>Jito</td>
      <td><strong>JTO</strong></td>
      <td>₹200.00</td>
      <td>$17,241.37931034</td>
      <td>0.22935780</td>
      <td>₹45.87</td>
      <td>$3,954.44482759</td>
    </tr>
    <tr>
      <td>Jupiter</td>
      <td><strong>JUP</strong></td>
      <td>₹50.85</td>
      <td>$4,383.62068966</td>
      <td>1.11</td>
      <td>₹56.40</td>
      <td>$4,862.04602703</td>
    </tr>
    <tr>
      <td>Kyber Network Crystal</td>
      <td><strong>KNC</strong></td>
      <td>₹40.00</td>
      <td>$3,448.27586207</td>
      <td>6.85</td>
      <td>₹273.88</td>
      <td>$23,610.24213794</td>
    </tr>
    <tr>
      <td>Lido DAO</td>
      <td><strong>LDO</strong></td>
      <td>₹98.94</td>
      <td>$8,529.31034483</td>
      <td>2.70</td>
      <td>₹267.15</td>
      <td>$23,030.40461892</td>
    </tr>
    <tr>
      <td>Chainlink</td>
      <td><strong>LINK</strong></td>
      <td>₹1,669.45</td>
      <td>$143,918.25215517</td>
      <td>0.15174507</td>
      <td>₹253.33</td>
      <td>$21,838.88524756</td>
    </tr>
    <tr>
      <td>Litecoin</td>
      <td><strong>LTC</strong></td>
      <td>₹9,999.99</td>
      <td>$862,068.10344828</td>
      <td>0.01000000</td>
      <td>₹100.00</td>
      <td>$8,620.68103448</td>
    </tr>
    <tr>
      <td>Decentraland</td>
      <td><strong>MANA</strong></td>
      <td>₹28.46</td>
      <td>$2,453.44887931</td>
      <td>7.96</td>
      <td>₹226.50</td>
      <td>$19,526.0555433</td>
    </tr>
    <tr>
      <td>Maker</td>
      <td><strong>MKR</strong></td>
      <td>₹2,04,888.87</td>
      <td>$17,662,833.62068966</td>
      <td>0.00102436</td>
      <td>₹209.88</td>
      <td>$18,093.10024769</td>
    </tr>
    <tr>
      <td>NEAR Protocol</td>
      <td><strong>NEAR</strong></td>
      <td>₹258.45</td>
      <td>$22,280.39258621</td>
      <td>0.46296296</td>
      <td>₹119.65</td>
      <td>$10,314.99650167</td>
    </tr>
    <tr>
      <td>Pepe</td>
      <td><strong>PEPE</strong></td>
      <td>₹0.00</td>
      <td>$0.09724138</td>
      <td>203.17K</td>
      <td>₹229.18</td>
      <td>$19,756.47704185</td>
    </tr>
    <tr>
      <td>Polygon</td>
      <td><strong>POL</strong></td>
      <td>₹21.16</td>
      <td>$1,824.14275862</td>
      <td>11.00</td>
      <td>₹232.78</td>
      <td>$20,067.57710251</td>
    </tr>
    <tr>
      <td>Push Protocol</td>
      <td><strong>PUSH</strong></td>
      <td>₹3.68</td>
      <td>$317.24137931</td>
      <td>58.43</td>
      <td>₹215.02</td>
      <td>$18,535.86791267</td>
    </tr>
    <tr>
      <td>Pyth Network</td>
      <td><strong>PYTH</strong></td>
      <td>₹11.77</td>
      <td>$1,014.26637931</td>
      <td>4.77</td>
      <td>₹56.08</td>
      <td>$4,834.44413135</td>
    </tr>
    <tr>
      <td>Raydium</td>
      <td><strong>RAY</strong></td>
      <td>₹272.12</td>
      <td>$23,458.62068966</td>
      <td>0.23923445</td>
      <td>₹65.10</td>
      <td>$5,612.11021845</td>
    </tr>
    <tr>
      <td>Shiden Network</td>
      <td><strong>S</strong></td>
      <td>₹29.62</td>
      <td>$2,553.44827586</td>
      <td>6.32</td>
      <td>₹187.11</td>
      <td>$16,130.4376148</td>
    </tr>
    <tr>
      <td>The Sandbox</td>
      <td><strong>SAND</strong></td>
      <td>₹27.68</td>
      <td>$2,386.57758621</td>
      <td>8.38</td>
      <td>₹231.86</td>
      <td>$19,988.08698612</td>
    </tr>
    <tr>
      <td>Shiba Inu</td>
      <td><strong>SHIB</strong></td>
      <td>₹0.00</td>
      <td>$0.10732759</td>
      <td>174.83K</td>
      <td>₹217.66</td>
      <td>$18,763.56468532</td>
    </tr>
    <tr>
      <td>Solana</td>
      <td><strong>SOL</strong></td>
      <td>₹16,553.69</td>
      <td>$1,427,042.06034483</td>
      <td>0.00332867</td>
      <td>₹55.10</td>
      <td>$4,750.15209501</td>
    </tr>
    <tr>
      <td>Spell Token</td>
      <td><strong>SPELL</strong></td>
      <td>₹0.05</td>
      <td>$4.07758621</td>
      <td>4.36K</td>
      <td>₹206.37</td>
      <td>$17,790.51575043</td>
    </tr>
    <tr>
      <td>Storj</td>
      <td><strong>STORJ</strong></td>
      <td>₹26.61</td>
      <td>$2,294.39353448</td>
      <td>8.22</td>
      <td>₹218.69</td>
      <td>$18,852.86388382</td>
    </tr>
    <tr>
      <td>Celestia</td>
      <td><strong>TIA</strong></td>
      <td>₹177.01</td>
      <td>$15,259.48275862</td>
      <td>0.40000000</td>
      <td>₹70.80</td>
      <td>$6,103.79310345</td>
    </tr>
    <tr>
      <td>TRON</td>
      <td><strong>TRX</strong></td>
      <td>₹28.64</td>
      <td>$2,468.81655172</td>
      <td>8.00</td>
      <td>₹229.11</td>
      <td>$19,750.53241376</td>
    </tr>
    <tr>
      <td>Uniswap</td>
      <td><strong>UNI</strong></td>
      <td>₹941.89</td>
      <td>$81,197.4137931</td>
      <td>0.27932961</td>
      <td>₹263.10</td>
      <td>$22,680.84192784</td>
    </tr>
    <tr>
      <td>USD Coin</td>
      <td><strong>USDC</strong></td>
      <td>₹88.12</td>
      <td>$7,596.55172414</td>
      <td>3.00</td>
      <td>₹264.36</td>
      <td>$22,789.65517242</td>
    </tr>
    <tr>
      <td>Tether</td>
      <td><strong>USDT</strong></td>
      <td>₹88.25</td>
      <td>$7,607.75862069</td>
      <td>3.00</td>
      <td>₹264.75</td>
      <td>$22,823.27586207</td>
    </tr>
    <tr>
      <td>WazirX</td>
      <td><strong>WRX</strong></td>
      <td>₹3.29</td>
      <td>$283.61896552</td>
      <td>47.92</td>
      <td>₹157.64</td>
      <td>$13,589.79230948</td>
    </tr>
    <tr>
      <td>Stellar</td>
      <td><strong>XLM</strong></td>
      <td>₹39.05</td>
      <td>$3,366.28862069</td>
      <td>0.15000000</td>
      <td>₹5.86</td>
      <td>$504.9432931</td>
    </tr>
    <tr>
      <td>XRP</td>
      <td><strong>XRP</strong></td>
      <td>₹283.38</td>
      <td>$24,429.22043103</td>
      <td>1.00</td>
      <td>₹283.38</td>
      <td>$24,429.22043103</td>
    </tr>
    <tr>
      <td>0x</td>
      <td><strong>ZRX</strong></td>
      <td>₹24.27</td>
      <td>$2,092.30862069</td>
      <td>9.14</td>
      <td>₹221.75</td>
      <td>$19,116.57030994</td>
    </tr>
  </tbody>
</table>


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
</style>
<!-- CRYPTO PRICE TABLE END -->

## ✨ Features

- 🔄 **Real-time Price Updates**: Fetches current INR prices from ZebPay API
- 💰 **Portfolio Tracking**: Tracks 70+ cryptocurrencies with your custom amounts
- 📊 **Sortable Table**: Interactive table with sorting by name, price, and fees
- ⚡ **Automated Updates**: Weekly automatic updates via GitHub Actions
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🛡️ **Error Handling**: Robust error handling with retry mechanisms
- 📈 **Portfolio Summary**: Total value, fees, and net worth calculations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd crypto-price-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run your first update**
   ```bash
   npm run refresh
   ```

That's it! Your README.md will be updated with the latest crypto prices.

## 📊 Usage

### Manual Refresh

```bash
# Quick refresh
npm run refresh

# Check status
npm run status

# Development mode
npm run dev
```

### Using the Refresh Script

```bash
# Run the interactive refresh script
node refresh.js
```

### Automated Updates

The GitHub Action runs automatically:

- **Weekly**: Every Sunday at 5:30 AM IST
- **Manual**: Trigger from GitHub Actions tab
- **On Push**: When you update the code

## ⚙️ Configuration

### Adding/Modifying Tokens

Edit `src/config/tokens.json` to customize your portfolio:

```json
{
  "tokens": {
    "BTC": {
      "name": "Bitcoin",
      "symbol": "BTC",
      "withdrawalFee": 0.0004,
      "amount": 0.01
    }
  }
}
```

### API Configuration

Modify the API settings in the same file:

```json
{
  "api": {
    "baseUrl": "https://www.zebapi.com/pro/v1",
    "timeout": 10000,
    "retryAttempts": 3,
    "retryDelay": 1000
  }
}
```

## 🔧 GitHub Actions Setup

1. **Enable Actions**: Go to your repository Settings → Actions → General
2. **Set Permissions**: Allow Actions to write to repository
3. **Manual Trigger**: Go to Actions tab → "Update Crypto Prices" → "Run workflow"

### Optional: Issue Creation on Failure

Add this secret to create issues when updates fail:

- `CREATE_ISSUE_ON_FAILURE`: Set to `true`

## 📁 Project Structure

```
crypto-price-tracker/
├── src/
│   ├── api/           # ZebPay API client
│   ├── calculator/    # Price calculations
│   ├── config/        # Token configuration
│   ├── table/         # HTML table generation
│   ├── updater/       # README.md management
│   ├── utils/         # Utilities and logging
│   └── main.ts        # Main application
├── .github/
│   └── workflows/     # GitHub Actions
├── tests/             # Test files
└── README.md          # This file (updated automatically)
```

## 🛠️ Development

### Running Tests

```bash
npm test
```

### Development Mode

```bash
npm run dev
```

### Building

```bash
npm run build
```

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Failed**

   - Check your internet connection
   - Verify ZebPay API is accessible
   - Check for rate limiting

2. **Build Errors**

   - Ensure Node.js 18+ is installed
   - Run `npm install` to update dependencies
   - Check TypeScript compilation errors

3. **GitHub Actions Failing**
   - Check repository permissions
   - Verify workflow file syntax
   - Check action logs for specific errors

### Debug Mode

Run with detailed logging:

```bash
DEBUG=* npm run dev
```

### Status Check

Check the current status of your tracker:

```bash
npm run status
```

## 📈 Supported Tokens

This tracker supports 70+ cryptocurrencies including:

- **Major Coins**: BTC, ETH, BNB, ADA, DOT, LINK, LTC
- **DeFi Tokens**: UNI, AAVE, COMP, CRV, SUSHI, MKR
- **Altcoins**: DOGE, SHIB, PEPE, FLOKI, and many more
- **Stablecoins**: USDT, USDC, BUSD

See `src/config/tokens.json` for the complete list.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [ZebPay](https://apidocs.zebpay.com/) for providing the API
- GitHub Actions for automation
- The crypto community for inspiration

---

**⚠️ Disclaimer**: This tool is for informational purposes only. Cryptocurrency investments carry risk. Always do your own research before making investment decisions.
