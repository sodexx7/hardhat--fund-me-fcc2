const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config.js")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let FundMe
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("100")
          this.beforeEach(async function () {
              // deploy our fundme contract
              // using Hadrdhat-deploy
              // const accounts = await ethers.getSigners()
              // const accountZero = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) //fixture  can execute the tags tuncitons
              FundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggaregator address correctly,", async function () {
                  const response = await FundMe.priceFeed()
                  assert.equal(response, MockV3Aggregator.address)
              })
          })

          describe("fund", async function () {
              it("Fails if you don't send enought ETH", async function () {
                  await expect(FundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updated the amount funded data structure", async function () {
                  await FundMe.fund({ value: sendValue })
                  const response = await FundMe.addressToAmountFunded(deployer)
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("adds funder to array of funders", async function () {
                  await FundMe.fund({ value: sendValue })
                  const funder = await FundMe.funders(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await FundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  // act
                  const tranasctionResponse = await FundMe.withdraw()
                  const tranasctionReceipt = await tranasctionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tranasctionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await FundMe.provider.getBalance(
                      FundMe.address
                  )
                  const endingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("withdraw ETH from a single founder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  // act
                  const tranasctionResponse = await FundMe.withdraw()
                  const tranasctionReceipt = await tranasctionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tranasctionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await FundMe.provider.getBalance(
                      FundMe.address
                  )
                  const endingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("allows us to Withdraw with multipule funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundmeConnnectedContract = await FundMe.connect(
                          accounts[i]
                      )
                      await fundmeConnnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)

                  // act
                  const tranasctionResponse = await FundMe.cheaperWithdraw()
                  const tranasctionReceipt = await tranasctionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tranasctionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  // Assert
                  const endingFundMeBalance = await FundMe.provider.getBalance(
                      FundMe.address
                  )
                  const endingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that the funders are rest properly
                  await expect(FundMe.funders(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await FundMe.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  // console.log(accounts)
                  const attacker = accounts[1]
                  const attackerConnectedContract = await FundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe_NotOwner")
              })

              it("cheaperWithDraw...", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundmeConnnectedContract = await FundMe.connect(
                          accounts[i]
                      )
                      await fundmeConnnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await FundMe.provider.getBalance(FundMe.address)
                  const startingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)

                  // act
                  const tranasctionResponse = await FundMe.cheaperWithdraw()
                  const tranasctionReceipt = await tranasctionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = tranasctionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  // Assert
                  const endingFundMeBalance = await FundMe.provider.getBalance(
                      FundMe.address
                  )
                  const endingDeployerBalance =
                      await FundMe.provider.getBalance(deployer)

                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )

                  // Make sure that the funders are rest properly
                  await expect(FundMe.funders(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await FundMe.addressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
          })
      })
