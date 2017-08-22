pragma solidity ^0.4.6;

contract Splitter {
  address public owner;

  event LogSplitReceived(address sender, uint amount);
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
    onlyMe()
    payable
    returns(bool success)
  {
    if(msg.value == 0) revert();

    uint amountSplit = msg.value;

    LogSplitReceived(msg.sender, msg.value);

    if ( msg.value % 2 != 0 ) {
      amountSplit -= 1;
    }

    LogFundsSent(recipient1, amountSplit / 2);
    recipient1.transfer(halfValue);

    LogFundsSent(recipient1, amountSplit / 2);
    recipient2.transfer(halfValue);

    return true;
  }

  function killMe()
    public
    onlyMe()
  {
    if (this.balance > 0) {
      uint toSend = this.balance;
      this.balance = 0;
      LogFundsSent(owner, toSend);
      owner.transfer(toSend);
    }
    suicide(owner);
  }
}
