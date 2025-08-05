// next.config.js
const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('next').NextConfig} */
module.exports = {
    output: 'export',
    basePath: (isProd && isGitHubPages) ? '/zebpay-withdraw-fees' : '',
    assetPrefix: (isProd && isGitHubPages) ? '/zebpay-withdraw-fees/' : '',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
};
