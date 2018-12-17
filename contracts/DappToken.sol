pragma solidity ^0.4.23;

library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }
 
  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }
 
  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }
 
  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}


contract DappToken {
	using SafeMath for uint256; 
	
	string public name = "Dapp Token";
	string public symbol = "DAPP";
	uint256 public totalSupply;
	string public standard = "Dapp Token v1.0";

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;
	

	event Transfer(
		address indexed _from, 
		address indexed _to, 
		uint256 _value);

	event Approval(
		address indexed _owner, 
		address indexed _spender, 
		uint256 _value);

	//constructor
	function DappToken(uint256 _initialSupply) public{
		totalSupply = _initialSupply;

		//allocate _initialSupply
		balanceOf[msg.sender] = _initialSupply;
	}

	//Transfer
	function transfer(address _to, uint256 _value) public returns(bool success){
	//trigger exception if not enough balance
	require (balanceOf[msg.sender] >= _value);
	require (balanceOf[_to] + _value >= balanceOf[_to]);
	
	//transfer balance
	balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
	balanceOf[_to] = balanceOf[_to].add(_value);

	//Trigger transfer event
	Transfer(msg.sender,_to,_value);

	return true;
	}

	//allowance
	function allowance(address _owner, address _spender) public view returns (uint256 remaining){
		return allowance[_owner][_spender];
	}

	//approve
	function approve(address _spender, uint256 _value) public returns (bool success){
		
		//allowance
		allowance[msg.sender][_spender] = _value;
		
		//approve event
		Approval(msg.sender, _spender, _value);
		return true;
	}

	//transferFrom
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){

		require (balanceOf[_from] >= _value);
		require (allowance[_from][msg.sender] >= _value);

		balanceOf[_from] = balanceOf[_from].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);

		allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);

		Transfer(_from, _to, _value);
		return true;
		
		
	}
}