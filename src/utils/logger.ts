export class Logger {
    private static instance: Logger;
    private logs: string[] = [];

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    info(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] INFO: ${message}`;
        console.log(logMessage);
        this.logs.push(logMessage);
    }

    error(message: string, error?: Error): void {
        const timestamp = new Date().toISOString();
        const errorDetails = error ? ` - ${error.message}` : '';
        const logMessage = `[${timestamp}] ERROR: ${message}${errorDetails}`;
        console.error(logMessage);
        this.logs.push(logMessage);
    }

    warn(message: string): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] WARN: ${message}`;
        console.warn(logMessage);
        this.logs.push(logMessage);
    }

    getLogs(): string[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }

    getMetrics(): {
        totalLogs: number;
        errorCount: number;
        warnCount: number;
        infoCount: number;
    } {
        const errorCount = this.logs.filter(log => log.includes('ERROR')).length;
        const warnCount = this.logs.filter(log => log.includes('WARN')).length;
        const infoCount = this.logs.filter(log => log.includes('INFO')).length;

        return {
            totalLogs: this.logs.length,
            errorCount,
            warnCount,
            infoCount
        };
    }
}