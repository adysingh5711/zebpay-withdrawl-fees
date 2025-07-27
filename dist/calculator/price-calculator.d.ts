import { TokenPrice, TokenConfig, ProcessedToken } from '../api/api-types';
export declare class PriceCalculator {
    calculateWithdrawalFeesInr(nativeFee: number, tokenPriceINR: number): number;
    calculateWithdrawalFeesUsd(nativeFee: number, tokenPriceUSD: number): number;
    processTokenData(tokenConfigs: Record<string, TokenConfig>, tokenPrices: TokenPrice[]): Promise<ProcessedToken[]>;
    validateTokenConfig(config: TokenConfig): boolean;
    validateTokenConfigs(configs: Record<string, TokenConfig>): {
        valid: TokenConfig[];
        invalid: string[];
    };
    formatCurrencyINR(amount: number): string;
    formatCurrencyUSD(amount: number): string;
    formatTokenAmount(amount: number): string;
}
//# sourceMappingURL=price-calculator.d.ts.map