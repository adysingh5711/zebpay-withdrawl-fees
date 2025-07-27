# 🚀 Crypto Portfolio Tracker

A comprehensive cryptocurrency portfolio tracker that fetches real-time INR prices from ZebPay API and displays your token holdings with withdrawal fees in a beautiful, sortable table format.

## 📊 Zebpay Withdrawl Fees

<!-- CRYPTO PRICE TABLE START -->

_Table will be automatically generated here after first run_

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
