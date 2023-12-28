require('dotenv').config();
const { Web3 } = require('web3');
const express = require('express');
const promClient = require('prom-client');

const app = express();
const register = new promClient.Registry();

const walletBalance = new promClient.Gauge({
    name: 'wallet_balance',
    help: 'Wallet balance in ETH',
    labelNames: ['network']
});

register.registerMetric(walletBalance);

// Dynamically load networks from .env
const networks = {};
for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('RPC_URL_')) {
        const networkName = key.replace('RPC_URL_', '');
        networks[networkName] = value;
    }
}

const walletAddress = process.env.WALLET_ADDRESS;

async function updateWalletBalances() {
    try {
        for (const [network, rpcUrl] of Object.entries(networks)) {
            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
            const balance = await web3.eth.getBalance(walletAddress);
            const balanceInETH = parseFloat(web3.utils.fromWei(balance, 'ether'));
            walletBalance.set({ network: network }, balanceInETH);
        }
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
    }
}
// Pre-run
updateWalletBalances()
setInterval(updateWalletBalances, 10000); // Update every 10s

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(9091, () => {
    console.log('Metrics server started on http://localhost:9091');
});
