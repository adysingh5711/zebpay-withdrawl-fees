import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './../components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        default: 'ZebPay Crypto Price Tracker - Real-time INR Prices & Withdrawal Fees',
        template: '%s | ZebPay Crypto Tracker'
    },
    description: 'Track real-time cryptocurrency prices in INR from ZebPay API. View Bitcoin, Ethereum, and other crypto prices with withdrawal fees. Updated weekly with automated price tracking.',
    keywords: [
        'crypto prices',
        'cryptocurrency tracker',
        'ZebPay prices',
        'Bitcoin price INR',
        'Ethereum price INR',
        'crypto withdrawal fees',
        'real-time crypto prices',
        'cryptocurrency portfolio',
        'Indian crypto prices',
        'BTC ETH prices'
    ],
    authors: [{ name: 'Crypto Price Tracker' }],
    creator: 'Crypto Price Tracker',
    publisher: 'GitHub Pages',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://adysingh5711.github.io/zebpay-withdraw-fees/',
        siteName: 'ZebPay Crypto Price Tracker',
        title: 'ZebPay Crypto Price Tracker - Real-time INR Prices',
        description: 'Track real-time cryptocurrency prices in INR from ZebPay API. View Bitcoin, Ethereum, and other crypto prices with withdrawal fees.',
        // images: [
        //     {
        //         url: 'https://adysingh5711.github.io/zebpay-withdraw-fees/og-image.png',
        //         width: 1200,
        //         height: 630,
        //         alt: 'ZebPay Crypto Price Tracker',
        //     },
        // ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ZebPay Crypto Price Tracker - Real-time INR Prices',
        description: 'Track real-time cryptocurrency prices in INR from ZebPay API with withdrawal fees.',
        // images: ['https://adysingh5711.github.io/zebpay-withdraw-fees/og-image.png'],
        creator: '@cryptotracker',
    },
    verification: {
        // google: 'your-google-verification-code', // Replace with actual verification code
    },
    alternates: {
        canonical: 'https://adysingh5711.github.io/zebpay-withdraw-fees/',
    },
    category: 'finance',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}