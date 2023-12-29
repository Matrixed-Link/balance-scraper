
# Balance-Scraper

## Description

Balance-Scraper is a Node.js application designed to fetch and monitor the native gas balances of specified wallets across multiple EVM networks. It leverages Web3.js for blockchain interactions and Prometheus for metric collection. The application is configured via a `config.json` file, allowing for flexible and dynamic network and wallet management.

## Features

- Fetches native gas balances from multiple networks (EVM).
- Integrated with Prometheus for metric scraping.
- Docker support for easy deployment and scaling.
- Configurable through `config.json` for dynamic wallet and network management.

## Prerequisites

- Node.js (v18.5)
- Docker and Docker Compose (for containerized setup)

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

3. **Configuration Setup:**

   Rename `config.json.example` to `config.json` and update the file with appropriate settings and wallet details.

## Usage

- **Direct Execution:**

  Run the application using Node.js:

  ```bash
  node app.js
  ```

- **Docker Deployment:**

  1. Build and start the Docker container:

     ```bash
     docker-compose up --build
     ```

  2. The application will be running and accessible at `http://localhost:9091`.

## Monitoring

Metrics are exposed at the `/metrics` endpoint for Prometheus scraping. Configure Prometheus to scrape metrics from `http://localhost:9091/metrics`.

## Docker Deployment

The provided `Dockerfile` and `docker-compose.yml` support seamless deployment. The `docker-compose.yml` includes configurations for auto-restarting and volume management. Use `docker-compose` commands for deployment.

## Contributing

We welcome contributions, issues, and feature requests. Feel free to check the [issues page](https://github.com/Matrixed-Link/balance-scraper/issues) if you want to contribute.

## License

[MIT](LICENSE)
