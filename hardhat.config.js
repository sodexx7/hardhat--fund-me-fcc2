require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    solidity: "0.8.7",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "",
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        Mumbai: {
            url: process.env.MUMBAI_RPC_URL || "",
            accounts: [process.env.PRIVATE_KEY],
            chainId: 80001,
            blockConfirmations: 6,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    // etherscan: {
    //     apiKey: ETHERSCAN_API_KEY,
    //     // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    // },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        token: "MATIC",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    mocha: {
        timeout: 500000,
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY,
        },
    },
}
