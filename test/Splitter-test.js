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

  it('should split even amounts to Bob and Carol and have a record of the amount for each recipient', () => {
    return contract.splitFunds(bob, carol, {from:alice, value: 10})
      .then( (txn) => {
        return contract.balances(bob);
      }).then( bobBalance => {
        assert.equal(bobBalance.toString(10), "5", "Recipient 1 did not receive the funds");
        return contract.balances(carol);
      }).then( carolBalance => {
        assert.equal(carolBalance.toString(10), "5", "Recipient 2 did not receive the funds");
      });
  });

  it('should split odd amounts to Bob and Carol and save the 1 Wei for Alice', () => {
    return contract.splitFunds(bob, carol, {from:alice, value: 11})
      .then( (txn) => {
        return contract.balances(bob);
      }).then( bobBalance => {
        assert.equal(bobBalance.toString(10), "5", "Recipient 1 did not receive the funds");
        return contract.balances(carol);
      }).then( carolBalance => {
        assert.equal(carolBalance.toString(10), "5", "Recipient 2 did not receive the funds");
        return contract.balances(alice);
      }).then( senderBalance => {
        assert.equal(senderBalance.toString(10), "1", "Send did not receive the remainder");
      });
  });

  // xit('should allow recipients to withdraw funds', () => {
  //   const bobBalance = web3.eth.balance(bob);
  //
  //   return contract.withdrawFunds({from:bob})
  //     .then( (txn) => {
  //       assert.equal(contract.balances[bob], 5, "Recipient 1 did not receive the funds");
  //       assert.equal(contract.balances[carol], 5, "Recipient 2 did not receive the funds");
  //       assert.equal(contract.balances[alice], 1, "Send did not receive the remainder");
  //     });
  // });

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
