export declare class Logger {
    private static instance;
    private logs;
    private constructor();
    static getInstance(): Logger;
    info(message: string): void;
    error(message: string, error?: Error): void;
    warn(message: string): void;
    getLogs(): string[];
    clearLogs(): void;
    getMetrics(): {
        totalLogs: number;
        errorCount: number;
        warnCount: number;
        infoCount: number;
    };
}
//# sourceMappingURL=logger.d.ts.map