pragma solidity ^0.4.6;

contract Splitter {
  address public owner;

  struct RecipientStruct {
    address recipient;
    uint amount;
  }
  RecipientStruct[] public recipientStructs;

  function Splitter(address recipient1, address recipient2) {
    owner = msg.sender;
    RecipientStruct memory firstRecipient;
    firstRecipient.recipient = recipient1;
    recipientStructs.push(firstRecipient);
    RecipientStruct memory secondRecipient;
    secondRecipient.recipient = recipient2;
    recipientStructs.push(secondRecipient);
  }

}
