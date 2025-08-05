// next.config.js
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
module.exports = {
    output: 'export',
    basePath: isProd ? '/zebpay-withdraw-fees' : '',
    assetPrefix: isProd ? '/zebpay-withdraw-fees/' : '',
    images: {
        unoptimized: true,
    },
};
