"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { ThemeSwitcher } from './../components/theme-switcher'
import { Button } from './../components/ui/button'
import { RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Github } from 'lucide-react'
import { ProcessedToken } from './../types/crypto'

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
        <div className="bg-background min-h-screen">
            {/* Theme Switcher */}
            <div className="top-4 right-4 fixed z-10">
                <ThemeSwitcher />
            </div>

            <div className="container px-4 py-8 mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-4 text-4xl font-bold">ZebPay Crypto Price Tracker</h1>
                    <p className="text-muted-foreground mb-6">
                        Real-time cryptocurrency prices and withdrawal fees from ZebPay
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Button
                            onClick={fetchPrices}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Refreshing...' : 'Refresh Prices'}
                        </Button>

                        {lastUpdated && (
                            <p className="text-muted-foreground text-sm">
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
                    <div className="bg-card p-6 mb-8 border rounded-lg">
                        <h2 className="mb-4 text-xl font-semibold">Summary</h2>
                        <div className="md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1 gap-4 text-sm">
                            <div>
                                <p className="font-medium">Total Tokens</p>
                                <p className="text-primary text-2xl font-bold">{tokens.length}</p>
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
                <div className="bg-card overflow-hidden border rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left p-3 min-w-[140px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('name')}
                                            className="flex items-center h-8 gap-2 px-2 -ml-2 font-semibold"
                                        >
                                            Token Name
                                            {getSortIcon('name')}
                                        </Button>
                                    </th>
                                    <th className="text-left p-3 min-w-[80px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('symbol')}
                                            className="flex items-center h-8 gap-2 px-2 -ml-2 font-semibold"
                                        >
                                            Symbol
                                            {getSortIcon('symbol')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-3 min-w-[120px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('priceINR')}
                                            className="flex items-center h-8 gap-2 px-2 ml-auto font-semibold"
                                        >
                                            Price (INR)
                                            {getSortIcon('priceINR')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-3 min-w-[120px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('priceUSD')}
                                            className="flex items-center h-8 gap-2 px-2 ml-auto font-semibold"
                                        >
                                            Price (USD)
                                            {getSortIcon('priceUSD')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-3 min-w-[100px]">
                                        <span className="text-sm font-semibold">Fee (Native)</span>
                                    </th>
                                    <th className="text-right p-3 min-w-[100px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('withdrawalFeeINR')}
                                            className="flex items-center h-8 gap-2 px-2 ml-auto font-semibold"
                                        >
                                            Fee (INR)
                                            {getSortIcon('withdrawalFeeINR')}
                                        </Button>
                                    </th>
                                    <th className="text-right p-3 min-w-[100px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('withdrawalFeeUSD')}
                                            className="flex items-center h-8 gap-2 px-2 ml-auto font-semibold"
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
                                        <td colSpan={7} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <RefreshCw className="animate-spin text-primary w-6 h-6" />
                                                <span className="text-muted-foreground">Loading prices...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : sortedTokens.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <span className="text-muted-foreground">No data available</span>
                                                <Button onClick={fetchPrices} variant="outline" size="sm">
                                                    Try Again
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedTokens.map((token, index) => (
                                        <tr
                                            key={token.id}
                                            className={`border-t hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                                                }`}
                                        >
                                            <td className="p-3 font-medium">{token.name}</td>
                                            <td className="p-3">
                                                <span className="text-primary bg-primary/10 px-2 py-1 text-sm font-bold rounded">
                                                    {token.symbol}
                                                </span>
                                            </td>
                                            <td className="p-3 font-mono text-sm text-right">
                                                {formatCurrency(token.priceINR, 'INR')}
                                            </td>
                                            <td className="p-3 font-mono text-sm text-right">
                                                {formatCurrency(token.priceUSD, 'USD')}
                                            </td>
                                            <td className="text-muted-foreground p-3 font-mono text-sm text-right">
                                                {formatTokenAmount(token.withdrawalFeeNative)}
                                            </td>
                                            <td className="p-3 font-mono text-sm font-semibold text-right">
                                                {formatCurrency(token.withdrawalFeeINR, 'INR')}
                                            </td>
                                            <td className="p-3 font-mono text-sm text-right">
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
                    <div className="text-muted-foreground flex items-center justify-center gap-2">
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