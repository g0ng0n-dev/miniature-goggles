const MyTokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
const KycContract = artifacts.require("KycContract");

const chai = require("./setupchai.js");
require('dotenv').config({path: '../.env'});

const BN = web3.utils.BN;
const expect = chai.expect;

contract("TokenSale Test", async(accounts) => {
    const[initialHolder, recipient, anotherAccount ] = accounts;

    it("should not have any tokens in my deployer account", async() => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf.call(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all coins should be in the tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(MyTokenSale.address);
        let totalSupply = await instance.totalSupply.call();
        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });
    
    it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await MyTokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);
        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.rejected;
        await expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));

        let kycInstance = await KycContract.deployed();
        await kycInstance.setKycCompleted(recipient);
        await expect(tokenSaleInstance.sendTransaction({from: recipient, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(recipient));
    
    });

} )