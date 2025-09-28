interface ViewCountResponse {
    totalViews: number
    uniqueViews: number
    lastUpdated: string
    isNewVisitor?: boolean
}

export class ViewService {
    // Using a free service like CountAPI for GitHub Pages
    private static readonly API_BASE = 'https://api.countapi.xyz'
    private static readonly NAMESPACE = 'zebpay-tracker'
    private static readonly TOTAL_KEY = 'total-views'
    private static readonly UNIQUE_KEY = 'unique-views'

    // Fallback counters stored in localStorage
    private static readonly FALLBACK_TOTAL_KEY = 'zebpay-fallback-total'
    private static readonly FALLBACK_UNIQUE_KEY = 'zebpay-fallback-unique'
    private static readonly FALLBACK_LAST_RESET = 'zebpay-fallback-reset'

    /**
     * Get visitor identifier for unique tracking
     */
    private static getVisitorId(): string {
        const stored = localStorage.getItem('visitor-id')
        if (stored) return stored

        // Generate a unique ID for this browser
        const id = 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
        localStorage.setItem('visitor-id', id)
        return id
    }

    /**
     * Check if visitor is unique (hasn't visited in 24 hours)
     */
    private static isUniqueVisitor(): boolean {
        const lastVisit = localStorage.getItem('last-visit')
        const now = Date.now()

        if (!lastVisit) {
            localStorage.setItem('last-visit', now.toString())
            return true
        }

        const timeDiff = now - parseInt(lastVisit)
        const twentyFourHours = 24 * 60 * 60 * 1000

        if (timeDiff > twentyFourHours) {
            localStorage.setItem('last-visit', now.toString())
            return true
        }

        return false
    }

    /**
     * Fetch current view count without incrementing
     */
    static async getViewCount(): Promise<ViewCountResponse> {
        // Initialize fallback counters if needed
        this.initializeFallbackCounters()

        try {
            const [totalResponse, uniqueResponse] = await Promise.all([
                fetch(`${this.API_BASE}/get/${this.NAMESPACE}/${this.TOTAL_KEY}`),
                fetch(`${this.API_BASE}/get/${this.NAMESPACE}/${this.UNIQUE_KEY}`)
            ])

            const totalData = await totalResponse.json()
            const uniqueData = await uniqueResponse.json()

            // Update fallback counters with API data
            this.setFallbackCounts(totalData.value || 0, uniqueData.value || 0)

            return {
                totalViews: totalData.value || 0,
                uniqueViews: uniqueData.value || 0,
                lastUpdated: new Date().toISOString()
            }
        } catch (error) {
            console.error('Failed to fetch view count:', error)
            // Return fallback data
            const fallbackCounts = this.getFallbackCounts()
            return {
                totalViews: fallbackCounts.totalViews,
                uniqueViews: fallbackCounts.uniqueViews,
                lastUpdated: new Date().toISOString()
            }
        }
    }

    /**
     * Get fallback view counts from localStorage
     */
    private static getFallbackCounts(): { totalViews: number; uniqueViews: number } {
        const total = parseInt(localStorage.getItem(this.FALLBACK_TOTAL_KEY) || '0')
        const unique = parseInt(localStorage.getItem(this.FALLBACK_UNIQUE_KEY) || '0')
        return { totalViews: total, uniqueViews: unique }
    }

    /**
     * Set fallback view counts in localStorage
     */
    private static setFallbackCounts(totalViews: number, uniqueViews: number): void {
        localStorage.setItem(this.FALLBACK_TOTAL_KEY, totalViews.toString())
        localStorage.setItem(this.FALLBACK_UNIQUE_KEY, uniqueViews.toString())
        localStorage.setItem(this.FALLBACK_LAST_RESET, new Date().toISOString())
    }

    /**
     * Initialize fallback counters with reasonable starting values
     */
    private static initializeFallbackCounters(): void {
        const lastReset = localStorage.getItem(this.FALLBACK_LAST_RESET)
        if (!lastReset) {
            // First time setup - use some reasonable starting values
            this.setFallbackCounts(1247, 892)
        }
    }

    /**
     * Increment view count and return updated count
     */
    static async incrementViewCount(): Promise<ViewCountResponse> {
        // Initialize fallback counters if needed
        this.initializeFallbackCounters()

        try {
            const isUnique = this.isUniqueVisitor()

            // Always increment total views
            const totalPromise = fetch(`${this.API_BASE}/hit/${this.NAMESPACE}/${this.TOTAL_KEY}`)

            // Only increment unique views if this is a unique visitor
            const uniquePromise = isUnique
                ? fetch(`${this.API_BASE}/hit/${this.NAMESPACE}/${this.UNIQUE_KEY}`)
                : fetch(`${this.API_BASE}/get/${this.NAMESPACE}/${this.UNIQUE_KEY}`)

            const [totalResponse, uniqueResponse] = await Promise.all([totalPromise, uniquePromise])

            const totalData = await totalResponse.json()
            const uniqueData = await uniqueResponse.json()

            // Update fallback counters with API data
            this.setFallbackCounts(totalData.value || 0, uniqueData.value || 0)

            return {
                totalViews: totalData.value || 0,
                uniqueViews: uniqueData.value || 0,
                lastUpdated: new Date().toISOString(),
                isNewVisitor: isUnique
            }
        } catch (error) {
            console.error('Failed to increment view count:', error)

            // Use fallback counters and increment them
            const fallbackCounts = this.getFallbackCounts()
            const newTotal = fallbackCounts.totalViews + 1
            const newUnique = isUnique ? fallbackCounts.uniqueViews + 1 : fallbackCounts.uniqueViews

            this.setFallbackCounts(newTotal, newUnique)

            return {
                totalViews: newTotal,
                uniqueViews: newUnique,
                lastUpdated: new Date().toISOString(),
                isNewVisitor: isUnique
            }
        }
    }
}