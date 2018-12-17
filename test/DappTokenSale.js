var DappTokenSale = artifacts.require("./DappTokenSale.sol");
var DappToken = artifacts.require("./DappToken.sol");

contract('DappTokenSale',function(accounts){
	var tokenInstance;
	var tokenSaleInstance;
	var tokenPrice = 1000000000000000; //in wei
	var buyer = accounts[1];
	var admin = accounts[0];
	var tokensAvailable = 750000;
	var numberOfTokens = 10;

	it('initialize the contract with correct value',function(){
		return DappTokenSale.deployed().then(function(instance){
			tokenSaleInstance = instance;
			return tokenSaleInstance.address;
		}).then(function(address){
			assert.notEqual(address, 0x0, 'contract address exist');
			return tokenSaleInstance.tokenContract();
		}).then(function(address){
			assert.notEqual(address, 0x0, 'tokenContract address exist');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price){
			assert.equal(price, tokenPrice, 'token price is correct')
		})
	});

	it('facilitates token buying',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
	   		return DappTokenSale.deployed();
		}).then(function(instance){
			tokenSaleInstance = instance;
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from:admin});
		}).then(function(receipt){
			return tokenSaleInstance.buyToken(numberOfTokens, {from: buyer, value: numberOfTokens*tokenPrice});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,"trigger one event");
			assert.equal(receipt.logs[0].event,"Sell","event is Sell");
			assert.equal(receipt.logs[0].args._buyer, accounts[1],"buyer is accounts[1]");
			assert.equal(receipt.logs[0].args._amount, 10,"amount is 10");
			return tokenSaleInstance.tokenSold();
		}).then(function(amount){
			assert.equal(amount.toNumber(),numberOfTokens,'increment the number of token sold');
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance){
			assert.equal(balance.toNumber(),tokensAvailable - numberOfTokens, "contract recieved tokens")
			return tokenSaleInstance.buyToken(numberOfTokens, {from: buyer, value: 1});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of token in wei');
			return tokenSaleInstance.buyToken(800000, {from: buyer, value: 800000000000000000000});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('enough') >= 0, 'cannot purchase more token than available');
		})
	})

	it('end token sale',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
	   		return DappTokenSale.deployed();
		}).then(function(instance){
			tokenSaleInstance = instance;
			return tokenSaleInstance.endSale({from:buyer});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'buyer is not qualified to end sale');
			return tokenSaleInstance.endSale({from:admin});
		}).then(function(receipt){
			return tokenInstance.balanceOf(admin);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 999990, 'return unsold balance to admin');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price){
			//token price reset when contract destructed
			assert(price.toNumber(), 0 , 'token price reseted')
		})
	})
	

})