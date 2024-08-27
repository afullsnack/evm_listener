# EVM Listener

EVM event listener for the wrapcbdc project to get notification when ever a deposit is made to an
internal account.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
# Steps to install the project
git clone https://github.com/asc-africa/asc_evm_listener.git
cd asc_evm_listener
bun install // use pnpm
```

## Usage

Update environment variables with webhook endpoint to call when an emitted event is received,
and add authentication parameters for calling said endpoint.

Update block number in `block_tracker.csv` file, you want the listener to start pulling blocks from,
if no value is found it would start from the latest block at the moment the program is ran.

Run the `docker-compose` command to build and start the container, when an event is emitted the
configured webhook is called.

```bash
docker-compose up --build -d
```

## Configuration

Environment variables.

The `.env.example` file contains sample environment variables used in the program. Change this as you
see fit, to listen to different contract or call a different webhook.

```
WEBHOOK_PROXY_PAYLOAD=
MAIN_API_WEBHOOK=
CONTRACT_ADDRESS=

```
The webhook proxy is a proxy webhook utilising the [smee](https://smee.io/) service to proxy secure
webhook calls to development environment for testing purposes.

> The `WEBHOOK_PROXY_PAYLOAD` environment should not be used for production deployments

## API Reference

Brief overview of main functions/classes. For detailed docs, link to separate API documentation.

## Development

- Clone the repo
- install the dependency
- Add the required data to the `.env` file as outlined the `.env.example` file

## Testing

```bash
npm test
```

Explain different types of tests and how to run them.

## Deployment

Steps or link to deployment documentation.

## Contributing

- Submit PR's for review
- PR's should be short and solve a proposed issue

[CONTRIBUTING](CONTRIBUTING.md)

## License

This project is licensed under the MIT - see the [LICENSE.md](LICENSE.md) file for details.
