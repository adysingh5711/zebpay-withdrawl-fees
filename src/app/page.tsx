"use client"

import { useState, useEffect, useMemo } from 'react'
import { ThemeSwitcher } from '@/src/components/theme-switcher'
import { Button } from '@/src/components/ui/button'
import { RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Github } from 'lucide-react'
import { ProcessedToken } from '@/src/types/crypto'

type SortField = 'name' | 'symbol' | 'priceINR' | 'priceUSD' | 'withdrawalFeeINR' | 'withdrawalFeeUSD'
type SortDirection = 'asc' | 'desc'

export default function Home() {
    const [tokens, setTokens] = useState<ProcessedToken[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const [sortField, setSortField] = useState<SortField>('withdrawalFeeINR')
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    const fetchPrices = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/prices')
            if (response.ok) {
                const data = await response.json()
                setTokens(data.tokens)
                setLastUpdated(new Date(data.lastUpdated))
            }
        } catch (error) {
            console.error('Failed to fetch prices:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrices()
    }, [])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const sortedTokens = useMemo(() => {
        return [...tokens].sort((a, b) => {
            let aValue = a[sortField]
            let bValue = b[sortField]

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase()
                bValue = (bValue as string).toLowerCase()
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }, [tokens, sortField, sortDirection])

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
        return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    }

    const formatCurrency = (value: number, currency: 'INR' | 'USD') => {
        if (currency === 'INR') {
            return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
    }

    const formatTokenAmount = (value: number) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + 'M'
        } else if (value >= 1000) {
            return (value / 1000).toFixed(2) + 'K'
        } else if (value >= 1) {
            return value.toFixed(2)
        } else {
            return value.toFixed(8)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Theme Switcher */}
            <div className="fixed top-4 right-4 z-10">
                <ThemeSwitcher />
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">ZebPay Crypto Price Tracker</h1>
                    <p className="text-muted-foreground mb-6">
                        Real-time cryptocurrency prices and withdrawal fees from ZebPay
                    </p>

                    <div className="flex justify-center items-center gap-4 mb-6">
                        <Button
                            onClick={fetchPrices}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Refreshing...' : 'Refresh Prices'}
                        </Button>

                        {lastUpdated && (
                            <p className="text-sm text-muted-foreground">
                                Last updated: {lastUpdated.toLocaleString('en-IN', {
                                    timeZone: 'Asia/Kolkata',
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })} IST
                            </p>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="bg-card rounded-lg p-6 mb-8 border">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="font-medium">Total Tokens</p>
                                <p className="text-2xl font-bold text-primary">{tokens.length}</p>
                            </div>
                            <div>
                                <p className="font-medium">Data Source</p>
                                <p className="text-muted-foreground">ZebPay API</p>
                            </div>
                            <div>
                                <p className="font-medium">Currencies</p>
                                <p className="text-muted-foreground">INR & USD</p>
                            </div>
                            <div>
                                <p className="font-medium">Additional Fee</p>
                                <p className="text-muted-foreground">₹15 per withdrawal</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-2 font-semibold"
                                        >
                                            Token Name
                                            {getSortIcon('name')}
                                        </Button>
                                    </th>
                                    <th className="text-left p-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('symbol')}
                                            className="flex items-center gap-2 font-semibold"
                                        >
                                            Symbol
                                            {getSortIcon('symbol')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('priceINR')}
                                            className="flex items-center gap-2 font-semibold ml-auto"
                                        >
                                            Price (INR)
                                            {getSortIcon('priceINR')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('priceUSD')}
                                            className="flex items-center gap-2 font-semibold ml-auto"
                                        >
                                            Price (USD)
                                            {getSortIcon('priceUSD')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-4">
                                        <span className="font-semibold">Fee (Native)</span>
                                    </th>
                                    <th className="text-right p-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('withdrawalFeeINR')}
                                            className="flex items-center gap-2 font-semibold ml-auto"
                                        >
                                            Fee (INR)
                                            {getSortIcon('withdrawalFeeINR')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('withdrawalFeeUSD')}
                                            className="flex items-center gap-2 font-semibold ml-auto"
                                        >
                                            Fee (USD)
                                            {getSortIcon('withdrawalFeeUSD')}
                                        </Button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Loading prices...
                                            </div>
                                        </td>
                                    </tr>
                                ) : sortedTokens.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-8 text-muted-foreground">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    sortedTokens.map((token) => (
                                        <tr key={token.symbol} className="border-t hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium">{token.name}</td>
                                            <td className="p-4">
                                                <span className="font-bold text-primary">{token.symbol}</span>
                                            </td>
                                            <td className="p-4 text-right font-mono">
                                                {formatCurrency(token.priceINR, 'INR')}
                                            </td>
                                            <td className="p-4 text-right font-mono">
                                                {formatCurrency(token.priceUSD, 'USD')}
                                            </td>
                                            <td className="p-4 text-right font-mono">
                                                {formatTokenAmount(token.withdrawalFeeNative)}
                                            </td>
                                            <td className="p-4 text-right font-mono">
                                                {formatCurrency(token.withdrawalFeeINR, 'INR')}
                                            </td>
                                            <td className="p-4 text-right font-mono">
                                                {formatCurrency(token.withdrawalFeeUSD, 'USD')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Github className="w-4 h-4" />
                        <a
                            href="https://github.com/adysingh5711/zebpay-withdraw-fees"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                        >
                            View on GitHub
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    )
}