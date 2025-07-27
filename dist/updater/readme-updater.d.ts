export declare class ReadmeUpdater {
    private readmePath;
    private backupPath;
    constructor(readmePath?: string);
    updatePriceTable(tableHtml: string): Promise<void>;
    preserveExistingContent(newTable: string): Promise<string>;
    private findTableSection;
    private createTableSection;
    private createDefaultReadmeContent;
    private createBackup;
    private restoreFromBackup;
    cleanupBackup(): Promise<void>;
    validateReadmeIntegrity(): Promise<boolean>;
    getLastUpdateTime(): Promise<Date | null>;
    addUpdateLog(message: string): Promise<void>;
}
//# sourceMappingURL=readme-updater.d.ts.map