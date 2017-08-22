const Splitter = artifacts.require('./Splitter.sol');

contract('Splitter', (accounts) => {
  const alice = accounts[0],
        bob = accounts[1],
        carol = accounts[2];
  let contract;

  beforeEach( () => {
    return Splitter.new({from: alice})
      .then( (instance) => {
        contract = instance;
      });
  });

  it('should be owned by Alice', () => {
    return contract.owner({from:alice})
      .then( (owner) => {
        assert.strictEqual(owner, alice, "Contract is not owned by Alice");
      });
  });

  it('should split even amounts to Bob and Carol and have a record of amount sent to each recipient', () => {
    const bobBalance = web3.eth.getBalance(bob),
          carolBalance = web3.eth.getBalance(carol);

    return contract.splitFunds(bob, carol, {from:alice, value: 10})
      .then( (txn) => {
        assert.equal((bobBalance.plus(5)).toString(10), web3.eth.getBalance(bob).toString(10), "Recipient 1 did not receive the funds");
        assert.equal((carolBalance.plus(5)).toString(10), web3.eth.getBalance(carol).toString(10), "Recipient 2 did not receive the funds");
      });
  });

  it('should split odd amounts to Bob and Carol and save the 1 Wei', () => {
    const bobBalance = web3.eth.getBalance(bob);
    const carolBalance = web3.eth.getBalance(carol);

    return contract.splitFunds(bob, carol, {from:alice, value: 11})
      .then( (txn) => {
        assert.equal((bobBalance.plus(5)).toString(10), web3.eth.getBalance(bob).toString(10), "Recipient 1 did not receive the funds");
        assert.equal((carolBalance.plus(5)).toString(10), web3.eth.getBalance(carol).toString(10), "Recipient 2 did not receive the funds");
        assert.equal(web3.eth.getBalance(contract.address).toString(10), 1, "Contract did not save the extra Wei");
      });
  });

  it('Alice should be able to kill it', () => {
    return contract.killMe({from:alice})
      .then( (txn) => {
        return contract.owner({from:alice})
          .then( (owner) => {
            assert.strictEqual(owner, '0x', "Alice could not kill the contract");
          });
      });
  });
});
