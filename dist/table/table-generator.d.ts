import { ProcessedToken } from '../api/api-types';
export declare class TableGenerator {
    private calculator;
    constructor();
    generateSortableTable(tokens: ProcessedToken[], lastUpdated: Date): string;
    private createTableHeader;
    private createTableRows;
    private createSummary;
    private createRefreshButton;
    private addSortingScript;
}
//# sourceMappingURL=table-generator.d.ts.map