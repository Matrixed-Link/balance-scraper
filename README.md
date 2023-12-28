
# Balance-Scraper

## Description

Balance-Scraper is a Node.js application designed to fetch and monitor the ETH balance of a specified wallet address across multiple networks. It utilizes Web3.js for blockchain interactions and Prometheus for metric collection. The application supports dynamic network addition/removal via an environment configuration, making it highly flexible and adaptable.

## Features

- Fetch ETH balance from multiple networks (Arbitrum, Polygon, etc.).
- Prometheus integration for metric scraping.
- Dockerized for easy deployment and scaling.
- Dynamic network management through `.env` file configuration.

## Prerequisites

- Node.js (v18.5)
- Docker and Docker Compose (for containerized setup)
- An Ethereum wallet address

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Matrixed-Link/balance-scraper.git
   cd balance-scraper
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Create a `.env` file in the root directory with the following contents:

   ```env
    WALLET_ADDRESS=[WALLET_TO_TRACK]
    RPC_URL_ETHEREUM=https://RPCURL
    # Add other networks as needed with RPC_URL_[NETWORK_NAME] format
   ```

## Usage

- **Direct Execution:**

  Run the application directly using Node.js:

  ```bash
  node app.js
  ```

- **Docker:**

  1. Build and start the Docker container:

     ```bash
     docker-compose up --build
     ```

  2. The application will be running and can be accessed at `http://localhost:9091`.

## Docker Deployment

The provided `Dockerfile` and `docker-compose.yml` facilitate easy deployment. The `docker-compose.yml` includes configuration for auto-restarting and external network monitoring. Use `docker-compose` commands to manage the deployment.

## Monitoring

Metrics are exposed at `/metrics` endpoint for Prometheus scraping. Configure Prometheus to scrape data from `http://localhost:9091/metrics`.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/your-username/balance-scraper/issues) if you want to contribute.

## License

[MIT](LICENSE)
