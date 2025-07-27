"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor() {
        this.logs = [];
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    info(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] INFO: ${message}`;
        console.log(logMessage);
        this.logs.push(logMessage);
    }
    error(message, error) {
        const timestamp = new Date().toISOString();
        const errorDetails = error ? ` - ${error.message}` : '';
        const logMessage = `[${timestamp}] ERROR: ${message}${errorDetails}`;
        console.error(logMessage);
        this.logs.push(logMessage);
    }
    warn(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] WARN: ${message}`;
        console.warn(logMessage);
        this.logs.push(logMessage);
    }
    getLogs() {
        return [...this.logs];
    }
    clearLogs() {
        this.logs = [];
    }
    getMetrics() {
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
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map