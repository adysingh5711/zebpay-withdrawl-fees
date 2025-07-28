#!/usr/bin/env node

/**
 * Manual refresh script for crypto price tracker
 * This script can be run locally or triggered manually
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔄 Manual Crypto Price Refresh');
console.log('================================');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Error: package.json not found. Please run this script from the project root.');
    process.exit(1);
}

// Check if TypeScript files exist
if (!fs.existsSync('scripts/main.ts')) {
    console.error('❌ Error: Source files not found. Please ensure the project is properly set up.');
    process.exit(1);
}

console.log('📦 Building project...');

// Build the project
const buildProcess = spawn('npm', ['run', 'cli:build'], {
    stdio: 'inherit',
    shell: true
});

buildProcess.on('close', (buildCode) => {
    if (buildCode !== 0) {
        console.error('❌ Build failed. Please check the errors above.');
        process.exit(1);
    }

    console.log('✅ Build completed successfully');
    console.log('🚀 Starting price update...');

    // Run the main application
    const startProcess = spawn('npm', ['run', 'cli:start'], {
        stdio: 'inherit',
        shell: true
    });

    startProcess.on('close', (startCode) => {
        if (startCode === 0) {
            console.log('');
            console.log('🎉 Manual refresh completed successfully!');
            console.log('📊 Check your README.md file for updated prices.');
            console.log('');
            console.log('💡 Tips:');
            console.log('  - Run "npm run status" to check the current status');
            console.log('  - The GitHub Action will run automatically every Sunday');
            console.log('  - You can also trigger the GitHub Action manually from the Actions tab');
        } else {
            console.error('❌ Price update failed. Check the logs above for details.');
            process.exit(1);
        }
    });

    startProcess.on('error', (error) => {
        console.error('❌ Failed to start price update:', error.message);
        process.exit(1);
    });
});

buildProcess.on('error', (error) => {
    console.error('❌ Failed to build project:', error.message);
    process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    console.log('\n⚠️  Manual refresh interrupted by user');
    process.exit(0);
});