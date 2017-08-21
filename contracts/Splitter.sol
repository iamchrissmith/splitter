pragma solidity ^0.4.6;

contract Splitter {
  address public owner;
  uint public totalSent;

  struct RecipientStruct {
    address recipient;
    uint amount;
  }
  RecipientStruct[] public recipientStructs;

  event LogSplitReceived(address sender, uint amount);
  event LogSplitSent(address recipient, uint amount);

  function Splitter(address recipient1, address recipient2) {
    owner = msg.sender;
    RecipientStruct memory firstRecipient;
    firstRecipient.recipient = recipient1;
    recipientStructs.push(firstRecipient);
    RecipientStruct memory secondRecipient;
    secondRecipient.recipient = recipient2;
    recipientStructs.push(secondRecipient);
  }

  modifier onlyMe() {
    require( msg.sender == owner );
    _;
  }

  function splitFunds()
    public
    onlyMe()
    payable
    returns(bool success)
  {
    if(msg.value == 0) revert();

    LogSplitReceived(msg.sender, msg.value);

    totalSent += msg.value;
    uint halfValue = msg.value / 2;
    for(uint i=0; i<2; i++) {
      recipientStructs[i].recipient.transfer(halfValue);
      recipientStructs[i].amount += halfValue;
      LogSplitSent(recipientStructs[i].recipient, halfValue);
    }
    return true;
  }
}
