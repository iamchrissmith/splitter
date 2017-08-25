pragma solidity ^0.4.6;

contract Splitter {
  address public owner;
  mapping(address => uint) public balances;

  event LogSplitReceived(address sender, address recipient1, address recipient2, uint received);
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
    require(msg.value == 0);
    require(recipient1 != 0);
    require(recipient2 != 0);
    //check for empty addresses

    uint amountSplit = msg.value;

    if ( msg.value % 2 != 0 ) {
      amountSplit -= 1;
      balances[msg.sender] += 1;
    }

    uint halfValue = amountSplit / 2;

    LogSplitReceived(msg.sender, recipient1, recpient2, amountSplit);
    balances[recipient1] += halfValue;
    balances[recipient2] += halfValue;

    return true;
  }

  function withdrawFunds()
    public
    returns(bool success)
  {
    if(balances[msg.sender] == 0) revert();

    uint amountToSend = balances[msg.sender];
    balances[msg.sender] = 0;
    LogFundsSent(msg.sender, amountToSend);

    msg.sender.transfer(amountToSend);

    return true;
  }

  function destroy()
    public
    onlyMe()
  {
    selfdestruct(owner);
  }
}
