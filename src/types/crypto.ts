export interface ProcessedToken {
    id: string; // Original token key (e.g., "USDT_TRC20")
    name: string;
    symbol: string;
    priceINR: number;
    priceUSD: number;
    withdrawalFeeNative: number;
    withdrawalFeeINR: number;
    withdrawalFeeUSD: number;
}