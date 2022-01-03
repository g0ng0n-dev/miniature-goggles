const MyTokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("MyToken");
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

} )