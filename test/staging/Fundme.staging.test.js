const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let Fundme
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              deployer = (await getNamedAccounts).deployer
              Fundme = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await Fundme.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await Fundme.withdraw()
              await withdrawTxResponse.wait(1)
              const endingBalance = await Fundme.provider.getBalance(
                  Fundme.address
              )
              console.log(
                  endingBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
