declare class CryptoPriceTracker {
    private config;
    private zebPayClient;
    private calculator;
    private tableGenerator;
    private readmeUpdater;
    constructor();
    initialize(): Promise<void>;
    run(): Promise<void>;
    private loadConfiguration;
    private validateConfiguration;
    getStatus(): Promise<{
        lastUpdate: Date | null;
        totalTokens: number;
        validTokens: number;
        readmeExists: boolean;
    }>;
}
export { CryptoPriceTracker };
//# sourceMappingURL=main.d.ts.map