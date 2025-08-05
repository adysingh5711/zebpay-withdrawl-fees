// next.config.js
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
module.exports = {
    // Removed output: 'export' to support API routes
    basePath: isProd ? '/zebpay-withdraw-fees' : '',
    assetPrefix: isProd ? '/zebpay-withdraw-fees/' : '',
    images: {
        unoptimized: true,
    },
};
