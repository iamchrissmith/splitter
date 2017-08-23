pragma solidity ^0.4.6;

contract Splitter {
  address public owner;
  mapping(address => uint) public balances;

  event LogSplitReceived(address sender, address recipient, uint amount);
  event LogFundsSent(address recipient, uint amount);

  function Splitter() {
    owner = msg.sender;
  }

  modifier onlyMe() {
    require( msg.sender == owner );
    _;
  }

  function splitFunds(address recipient1, address recipient2)
    public
    payable
    returns(bool success)
  {
    if(msg.value == 0) revert();

    uint amountSplit = msg.value;

    if ( msg.value % 2 != 0 ) {
      amountSplit -= 1;
      balances[msg.sender] += 1;
    }

    uint halfValue = amountSplit / 2;

    LogSplitReceived(msg.sender, recipient1, halfValue);
    balances[recipient1] += halfValue;

    LogSplitReceived(msg.sender, recipient2, halfValue);
    balances[recipient2] += halfValue;

    return true;
  }

  function withdrawFunds()
    public
    returns(bool success)
  {
    if(balances[msg.sender] == 0) revert();

    uint toSend = balances[msg.sender];
    balances[msg.sender] = 0;
    LogFundsSent(msg.sender, toSend);

    msg.sender.transfer(toSend);

    return true;
  }

  function killMe()
    public
    onlyMe()
  {
    suicide(owner);
  }
}
