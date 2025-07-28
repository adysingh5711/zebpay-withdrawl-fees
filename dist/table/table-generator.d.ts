import { ProcessedToken } from '../api/api-types';
export declare class TableGenerator {
    private calculator;
    constructor();
    generateSortableTable(tokens: ProcessedToken[], lastUpdated: Date): string;
    private createMarkdownTableRows;
    private createSummary;
    private createRefreshButton;
}
//# sourceMappingURL=table-generator.d.ts.map