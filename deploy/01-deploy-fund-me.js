// import
// main function
// calling of main function

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

// function deployFunc(hre){
//     console.log("Hi")

// }

// module.exports.default=deployFunc

// const {getNameAccounts,deployments} = hre
// // hre.getNameAccounts
// //hre.deployments

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const etheUsedPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let etheUsedPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        etheUsedPriceFeedAddress = ethUsdAggregator.address
    } else {
        etheUsedPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    // if the contract doesn't exist,we deploy a minimal version for our local testing
    //

    // well happens what ?when want to change the chains
    //when going for localhost or hardhat network we want to use a mock

    const args = [etheUsedPriceFeedAddress]
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundme.address, args)
        //VERIFY
    }
    log("------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
