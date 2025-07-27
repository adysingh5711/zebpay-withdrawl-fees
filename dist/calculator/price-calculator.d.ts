import { TokenPrice, TokenConfig, ProcessedToken } from '../api/api-types';
export declare class PriceCalculator {
    calculateInrValue(tokenAmount: number, price: number): number;
    calculateWithdrawalFeesInr(nativeFee: number, tokenPrice: number): number;
    processTokenData(tokenConfigs: Record<string, TokenConfig>, tokenPrices: TokenPrice[]): Promise<ProcessedToken[]>;
    validateTokenConfig(config: TokenConfig): boolean;
    validateTokenConfigs(configs: Record<string, TokenConfig>): {
        valid: TokenConfig[];
        invalid: string[];
    };
    formatCurrency(amount: number, currency?: string): string;
    formatTokenAmount(amount: number): string;
    calculateTotalPortfolioValue(processedTokens: ProcessedToken[]): {
        totalValue: number;
        totalWithdrawalFees: number;
        netValue: number;
    };
}
//# sourceMappingURL=price-calculator.d.ts.map