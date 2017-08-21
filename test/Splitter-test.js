const Splitter = artifacts.require('./Splitter.sol');

contract('Splitter', (accounts) => {
  const alice = accounts[0],
        bob = accounts[1],
        carol = accounts[2];
  let contract;

  beforeEach( () => {
    return Splitter.new(bob, carol, {from: alice})
      .then( (instance) => {
        contract = instance;
      });
  });

  it('should be owned by Alice', () => {
    return contract.owner({from:owner})
      .then( (owner) => {
        assert.strictEqual(owner, alice, "Contract is not owned by Alice");
      });
  });

  it('should initialize with recipients', () => {
    return contract.recipientStructs({from:owner})
      .then( (recipients) => {
        assert.strictEqual(recipients[0], bob, "Contract did not store Recipient 1");
        assert.strictEqual(recipients[1], carol, "Contract did not store Recipient 2");
      });
  });

  it('should have a contract balance', () => {});

  it('should split even amounts to Bob and Carol', () => {});

  it('should split odd amounts to Bob and Carol and hold the extra Wei', () => {});

  it('should report balance of Alice', () => {});

  it('should report balance of Bob and Carol', () => {});

  it('Alice should be able to kill it', () => {});
});
