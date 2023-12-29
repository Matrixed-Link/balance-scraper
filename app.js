// Importing required modules
const config = require('./config.json'); // Configuration file
const { Web3 } = require('web3'); // Web3JS framework
const express = require('express'); // Express.js framework
const promClient = require('prom-client'); // Prometheus client for metrics

// Initialize Express application and Prometheus registry
const app = express();
const register = new promClient.Registry();

// Define log levels for application logging
const logLevels = {
    'DEBUG': 1,
    'INFO': 2,
    'WARN': 3,
    'ERROR': 4
};

// Log function to handle logging at different levels
function log(level, message) {
    const configLogLevel = logLevels[config.settings.LOG_LEVEL] || logLevels['INFO'];
    if (logLevels[level] >= configLogLevel) {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} [${level}] ${message}`);
    }
}

// Define a Prometheus gauge for tracking wallet balances
const walletBalance = new promClient.Gauge({
    name: 'wallet_balance',
    help: 'Wallet balance in native gas token',
    labelNames: ['network', 'walletName']
});
register.registerMetric(walletBalance);

// Load network RPC URLs and wallet addresses from the configuration
const networks = config.endpoints;
const walletAddresses = Object.fromEntries(
    Object.entries(config.wallets).map(([walletName, walletData]) => [walletName, walletData.address])
);

// Log the networks and wallets that will be scraped
const scrapableNetworks = Array.from(new Set(Object.values(config.wallets).flatMap(wallet => wallet.networks)));

// Check if RPC URLs are provided for all scrapable networks
const missingRpcUrls = scrapableNetworks.filter(network => !networks[network]);

if (missingRpcUrls.length > 0) {
    log('ERROR', `Missing RPC URLs for networks: ${missingRpcUrls.join(', ')}`);
    process.exit(1)
} else {
    log('INFO', `Scraping balances for networks: ${scrapableNetworks.join(', ')}`);
    log('INFO', `Scraping balances for wallets: ${Object.keys(walletAddresses).join(', ')}`);
}

// Function to update wallet balances
async function updateWalletBalances() {
    log('DEBUG','Scraping balances.');
    try {
        for (const [walletName, walletAddress] of Object.entries(walletAddresses)) {
            let walletNetworks = config.wallets[walletName].networks;

            // Normalize walletNetworks to an array
            walletNetworks = Array.isArray(walletNetworks) ? walletNetworks : [walletNetworks];

            for (const network of walletNetworks) {
                const rpcUrl = networks[network];
                // Check if the RPC URL is provided
                if (!rpcUrl) {
                    log('ERROR', `RPC URL for network ${network} not found.`);
                    continue;
                }

                const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

                try {
                    const balance = await web3.eth.getBalance(walletAddress);
                    const balanceInETH = parseFloat(web3.utils.fromWei(balance, 'ether'));

                    // Set the balance in the Prometheus gauge
                    walletBalance.set({ network, walletName }, balanceInETH);
                } catch (networkError) {
                    log('ERROR', `Error fetching balance for wallet ${walletName} on network ${network}: ${networkError}`);
                }
            }
        }
    } catch (error) {
        log('ERROR', 'Unexpected error during balance scraping:', error);
    }
}

// Pre-run scraping and set interval for periodic updates
const pollInterval = config.settings.POLL_TIMER || 15; // Default polling interval 15s
log('INFO', `Scraping every: ${pollInterval}s`);
updateWalletBalances();
setInterval(updateWalletBalances, pollInterval * 1000);

// Endpoint to expose metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    try {
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (metricsError) {
        log('ERROR', `Error fetching metrics: ${metricsError}`);
        res.status(500).send('Error fetching metrics');
    }
});

// Start the Express server
const port = config.settings.PORT || 9091;
app.listen(port, () => {
    log('INFO', `Metrics server started on http://localhost:${port}/metrics`);
});
