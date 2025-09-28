import { GitHubCounter } from './github-counter';

interface ViewCountResponse {
    totalViews: number;
    uniqueViews: number;
    lastUpdated: string;
    isNewVisitor?: boolean;
}

type CounterProvider = 'github' | 'fallback';

export class UnifiedCounter {
    private static currentProvider: CounterProvider = 'github'; // Default to GitHub
    private static fallbackCounts = { totalViews: 0, uniqueViews: 0 };
    private static readonly COUNTER_SYNC_KEY = 'zebpay-counter-sync';

    /**
     * Set the counter provider
     */
    static setProvider(provider: CounterProvider): void {
        this.currentProvider = provider;
    }

    /**
     * Get current view counts
     */
    static async getViewCount(): Promise<ViewCountResponse> {
        try {
            switch (this.currentProvider) {
                case 'github':
                    return await GitHubCounter.getViewCount();
                default:
                    return this.getFallbackCount();
            }
        } catch (error) {
            console.error(`Failed to get view count from ${this.currentProvider}:`, error);
            return this.getFallbackCount();
        }
    }

    /**
     * Increment view counts
     */
    static async incrementViewCount(): Promise<ViewCountResponse> {
        try {
            switch (this.currentProvider) {
                case 'github':
                    return await GitHubCounter.incrementViewCount();
                default:
                    return this.incrementFallbackCount();
            }
        } catch (error) {
            console.error(`Failed to increment view count from ${this.currentProvider}:`, error);
            return this.incrementFallbackCount();
        }
    }

    /**
     * Get fallback count from localStorage
     */
    private static getFallbackCount(): ViewCountResponse {
        const stored = localStorage.getItem('zebpay-fallback-counter');
        if (stored) {
            const data = JSON.parse(stored);
            return {
                totalViews: data.totalViews || this.fallbackCounts.totalViews,
                uniqueViews: data.uniqueViews || this.fallbackCounts.uniqueViews,
                lastUpdated: data.lastUpdated || new Date().toISOString()
            };
        }
        return {
            totalViews: this.fallbackCounts.totalViews,
            uniqueViews: this.fallbackCounts.uniqueViews,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Increment fallback count
     */
    private static incrementFallbackCount(): ViewCountResponse {
        const current = this.getFallbackCount();
        const isUnique = this.isUniqueVisitor();

        const newTotal = current.totalViews + 1;
        const newUnique = isUnique ? current.uniqueViews + 1 : current.uniqueViews;

        const newData = {
            totalViews: newTotal,
            uniqueViews: newUnique,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('zebpay-fallback-counter', JSON.stringify(newData));

        return {
            ...newData,
            isNewVisitor: isUnique
        };
    }

    /**
     * Check if visitor is unique (hasn't visited in 24 hours)
     */
    private static isUniqueVisitor(): boolean {
        const lastVisit = localStorage.getItem('last-visit');
        const now = Date.now();

        if (!lastVisit) {
            localStorage.setItem('last-visit', now.toString());
            return true;
        }

        const timeDiff = now - parseInt(lastVisit);
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (timeDiff > twentyFourHours) {
            localStorage.setItem('last-visit', now.toString());
            return true;
        }

        return false;
    }

    /**
     * Check if sync is needed (runs alongside price refresh schedule)
     */
    private static shouldSyncFromGitHub(): boolean {
        const now = new Date();
        const lastSync = localStorage.getItem(this.COUNTER_SYNC_KEY);

        // If no previous sync, always sync
        if (!lastSync) return true;

        const lastSyncDate = new Date(lastSync);
        const hoursSinceSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);

        // Sync if it's been more than 6 days (144 hours) - runs alongside price refresh
        return hoursSinceSync >= 144;
    }

    /**
     * Sync fallback counter with GitHub Issues data (runs alongside price refresh)
     */
    private static async syncFromGitHub(): Promise<void> {
        try {
            console.log('🔄 Syncing visitor counter alongside price refresh...');

            // Get data from GitHub Issues
            const githubData = await GitHubCounter.getViewCount();

            // Update fallback counter with GitHub data
            const syncData = {
                totalViews: githubData.totalViews,
                uniqueViews: githubData.uniqueViews,
                lastUpdated: githubData.lastUpdated,
                syncedFromGitHub: true,
                syncDate: new Date().toISOString()
            };

            localStorage.setItem('zebpay-fallback-counter', JSON.stringify(syncData));
            localStorage.setItem(this.COUNTER_SYNC_KEY, new Date().toISOString());

            console.log('✅ Visitor counter synced successfully');
        } catch (error) {
            console.error('❌ Visitor counter sync failed:', error);
        }
    }

    /**
     * Check and perform counter sync if needed (runs alongside price refresh)
     */
    static async checkAndSync(): Promise<void> {
        if (this.shouldSyncFromGitHub()) {
            await this.syncFromGitHub();
        }
    }


    /**
     * Test GitHub provider and fallback if needed
     */
    static async findBestProvider(): Promise<CounterProvider> {
        try {
            this.setProvider('github');
            await this.getViewCount();
            console.log('✅ GitHub provider is working');

            // Check for counter sync when GitHub is working (runs alongside price refresh)
            await this.checkAndSync();

            return 'github';
        } catch (error) {
            console.log('❌ GitHub provider failed, using fallback:', error);
            this.setProvider('fallback');
            return 'fallback';
        }
    }
}
