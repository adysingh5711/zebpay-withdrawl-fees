import { NextResponse } from 'next/server'
import { ZebPayClient } from '../../../api/zebpay-client'
import { PriceCalculator } from '../../../calculator/price-calculator'
import fs from 'fs-extra'
import path from 'path'

interface AppConfig {
    tokens: Record<string, {
        name: string;
        symbol: string;
        withdrawalFee: number;
    }>;
    api: {
        baseUrl: string;
        timeout: number;
        retryAttempts: number;
        retryDelay: number;
        validation: {
            primaryToken: string;
            fallbackTokens: string[];
            maxRetries: number;
            retryDelay: number;
            timeout: number;
        };
    };
}

export async function GET() {
    try {
        // Load configuration
        const configPath = path.join(process.cwd(), 'src', 'config', 'tokens.json')
        const configData = await fs.readFile(configPath, 'utf8')
        const config: AppConfig = JSON.parse(configData)

        // Initialize clients
        const zebPayClient = new ZebPayClient(config.api)
        const calculator = new PriceCalculator()

        // Get token symbols
        const tokenSymbols = Object.keys(config.tokens)

        // Fetch prices
        const tokenPrices = await zebPayClient.fetchMultipleTokenPrices(tokenSymbols)

        // Process token data
        const processedTokens = await calculator.processTokenData(
            config.tokens,
            tokenPrices
        )

        return NextResponse.json({
            tokens: processedTokens,
            lastUpdated: new Date().toISOString(),
            success: true
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch prices',
                success: false
            },
            { status: 500 }
        )
    }
}