export interface ProcessedToken {
    name: string;
    symbol: string;
    priceINR: number;
    priceUSD: number;
    withdrawalFeeNative: number;
    withdrawalFeeINR: number;
    withdrawalFeeUSD: number;
}