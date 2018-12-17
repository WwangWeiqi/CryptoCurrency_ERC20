pragma solidity ^0.4.23;

import "./DappToken.sol";

/**
 * The DappTokenSale contract does this and that...
 */
contract DappTokenSale {
	using SafeMath for uint256; 
	// using SafeMath for uint256; 
	address admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokenSold;

	event Sell(
		address _buyer,
		uint256 _amount);
	

	function DappTokenSale (DappToken _tokenContract, uint256 _tokenPrice) {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}	

	//buyToken
	function buyToken (uint256 _numberOfTokens) public payable{
        
        require (msg.value == _numberOfTokens.mul(tokenPrice));

        //'this' is address for current contract
        require(tokenContract.balanceOf(this) >= _numberOfTokens);

        require(tokenContract.transfer(msg.sender, _numberOfTokens));

		tokenSold = tokenSold.add(_numberOfTokens);
		Sell(msg.sender, _numberOfTokens);
	}


	function endSale () public {

		require (msg.sender == admin);
		require (tokenContract.transfer(admin, tokenContract.balanceOf(this)));
		
		selfdestruct(admin);
	}
	
	
}




