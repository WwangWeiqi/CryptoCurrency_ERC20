var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken',function(accounts){

	it("set initialSupply upon deployment", function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,"sets totalSupply to 1000000");
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,'allocate inital supply to adminBalance');
		})
	});

	it("initialize contract with correct values",function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,"Dapp Token","has correct name");
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,"DAPP","has correct symbol");
			
		})
	});

	it("transfer token ownership",function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			//test 'require' statemetn ensure sender has enough token
			return tokenInstance.transfer(accounts[1],99999999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'error message contain revert');
			return tokenInstance.transfer.call(accounts[1],10);
		}).then(function(success){
			assert.equal(success,true,"transfer success");
			return tokenInstance.transfer(accounts[1],10);
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,"trigger one event");
			assert.equal(receipt.logs[0].event,"Transfer","event is Transfer");
			assert.equal(receipt.logs[0].args._from, accounts[0],"transfer from accounts[0]");
			assert.equal(receipt.logs[0].args._to, accounts[1],"transfer to accounts[1]");
			assert.equal(receipt.logs[0].args._value, 10,"transfer value is 10");
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),10,'account1 recieve transfer');
		})
	});

	it("approve token for delegated transfer",function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.approve.call(accounts[1],100);
		}).then(function(success){
			assert.equal(success,true,"approve success");
			return tokenInstance.approve(accounts[1],100,{from: accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,"trigger one event");
			assert.equal(receipt.logs[0].event,"Approval","event is Transfer");
			assert.equal(receipt.logs[0].args._owner, accounts[0],"owner from accounts[0]");
			assert.equal(receipt.logs[0].args._spender, accounts[1],"spender to accounts[1]");
			assert.equal(receipt.logs[0].args._value, 100,"transfer value is 100");
			return tokenInstance.allowance(accounts[0],accounts[1]);
		}).then(function(allowance){
			assert.equal(allowance.toNumber(),100,'store allowance to delegated transfer');
			return tokenInstance.transferFrom(accounts[0],accounts[2],50, {from: accounts[1]});
		}).then(function(success){
			return tokenInstance.balanceOf(accounts[2]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),50,'account 2 recieved transfered')
		})
	})


	

})