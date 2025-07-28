import * as fs from 'fs-extra';
import * as path from 'path';

export class ReadmeUpdater {
    private readmePath: string;
    private backupPath: string;

    constructor(readmePath: string = 'README.md') {
        this.readmePath = readmePath;
        this.backupPath = `${readmePath}.backup`;
    }

    async updatePriceTable(tableHtml: string): Promise<void> {
        try {
            // Create backup before modifying
            await this.createBackup();

            const updatedContent = await this.preserveExistingContent(tableHtml);

            // Write updated content atomically
            const tempPath = `${this.readmePath}.tmp`;

            // Remove temp file if it exists
            if (await fs.pathExists(tempPath)) {
                await fs.remove(tempPath);
            }

            await fs.writeFile(tempPath, updatedContent, 'utf8');
            await fs.move(tempPath, this.readmePath, { overwrite: true });

            console.log('README.md updated successfully');

        } catch (error) {
            console.error('Error updating README.md:', error instanceof Error ? error.message : String(error));
            await this.restoreFromBackup();
            throw error;
        }
    }

    async preserveExistingContent(newTable: string): Promise<string> {
        let existingContent = '';

        try {
            if (await fs.pathExists(this.readmePath)) {
                existingContent = await fs.readFile(this.readmePath, 'utf8');
            }
        } catch (error) {
            console.warn('Could not read existing README.md, creating new one');
            existingContent = this.createDefaultReadmeContent();
        }

        const tableSection = this.findTableSection(existingContent);

        if (tableSection) {
            // Replace existing table section
            const beforeTable = existingContent.substring(0, tableSection.start);
            const afterTable = existingContent.substring(tableSection.end);
            return beforeTable + newTable + afterTable;
        } else {
            // Append table to existing content
            const separator = existingContent.trim() ? '\n\n' : '';
            return existingContent + separator + this.createTableSection(newTable);
        }
    }

    private findTableSection(content: string): { start: number; end: number } | null {
        const startMarker = '<!-- CRYPTO PRICE TABLE START -->';
        const endMarker = '<!-- CRYPTO PRICE TABLE END -->';

        const startIndex = content.indexOf(startMarker);
        const endIndex = content.indexOf(endMarker);

        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            return {
                start: startIndex,
                end: endIndex + endMarker.length
            };
        }

        return null;
    }

    private createTableSection(tableHtml: string): string {
        return `## 📊 Crypto Portfolio Tracker

${tableHtml}

---

*This table is automatically updated via GitHub Actions. Price data is fetched from ZebPay API.*`;
    }

    private createDefaultReadmeContent(): string {
        return `# Crypto Portfolio Tracker

Welcome to my cryptocurrency portfolio tracker! This repository automatically fetches real-time prices from ZebPay and displays my token holdings with withdrawal fees.

## Features

- 🔄 Real-time price updates from ZebPay API
- 💰 INR price conversion for all tokens
- 📊 Sortable table with withdrawal fees
- ⚡ Automated weekly updates via GitHub Actions
- 📱 Mobile-responsive design

`;
    }

    private async createBackup(): Promise<void> {
        try {
            if (await fs.pathExists(this.readmePath)) {
                await fs.copy(this.readmePath, this.backupPath);
                console.log('Backup created successfully');
            }
        } catch (error) {
            console.warn('Could not create backup:', error instanceof Error ? error.message : String(error));
        }
    }

    private async restoreFromBackup(): Promise<void> {
        try {
            if (await fs.pathExists(this.backupPath)) {
                await fs.copy(this.backupPath, this.readmePath);
                console.log('Restored from backup');
            }
        } catch (error) {
            console.error('Could not restore from backup:', error instanceof Error ? error.message : String(error));
        }
    }

    async cleanupBackup(): Promise<void> {
        try {
            if (await fs.pathExists(this.backupPath)) {
                await fs.remove(this.backupPath);
                console.log('Backup cleaned up');
            }
        } catch (error) {
            console.warn('Could not cleanup backup:', error instanceof Error ? error.message : String(error));
        }
    }

    async validateReadmeIntegrity(): Promise<boolean> {
        try {
            if (!(await fs.pathExists(this.readmePath))) {
                return false;
            }

            const content = await fs.readFile(this.readmePath, 'utf8');
            const tableSection = this.findTableSection(content);

            // Check if table section exists and is properly formatted
            if (tableSection) {
                const tableContent = content.substring(tableSection.start, tableSection.end);
                return tableContent.includes('crypto-price-table') &&
                    tableContent.includes('Token Name') &&
                    tableContent.includes('Withdrawal Fee');
            }

            return true; // README exists but no table section yet

        } catch (error) {
            console.error('Error validating README integrity:', error instanceof Error ? error.message : String(error));
            return false;
        }
    }

    async getLastUpdateTime(): Promise<Date | null> {
        try {
            if (!(await fs.pathExists(this.readmePath))) {
                return null;
            }

            const content = await fs.readFile(this.readmePath, 'utf8');
            const lastUpdatedMatch = content.match(/\*\*Last Updated:\*\* (.+?) IST/);

            if (lastUpdatedMatch) {
                return new Date(lastUpdatedMatch[1]);
            }

            return null;

        } catch (error) {
            console.error('Error getting last update time:', error instanceof Error ? error.message : String(error));
            return null;
        }
    }

    async addUpdateLog(message: string): Promise<void> {
        const logPath = 'update-log.md';
        const timestamp = new Date().toISOString();
        const logEntry = `- ${timestamp}: ${message}\n`;

        try {
            await fs.appendFile(logPath, logEntry, 'utf8');
            console.log(`📝 Update Log [${timestamp}]: ${message}`);
        } catch (error) {
            console.warn('Could not write to update log:', error instanceof Error ? error.message : String(error));
        }
    }
}