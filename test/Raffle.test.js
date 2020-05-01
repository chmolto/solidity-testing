const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let raffle;
let manager;
let contractAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];
  raffle = await new web3.eth.Contract(JSON.parse(interface)).deploy({ data: bytecode }).send({
    from: manager,
    gas: '1000000',
  });
});

describe('Raffle Contract', () => {
  it('deploys a contract', () => {
    contractAddress = raffle.options.address;
    assert.ok(contractAddress);
  });

  it('allows multiple accounts to the raffle', async () => {
    await raffle.methods.enter().send({
      from: manager,
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await raffle.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.01', 'ether'),
    });
    await raffle.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.01', 'ether'),
    });

    const players = await raffle.methods.getPlayers().call();
    assert.equal(manager, players[0]);
  });

  it('requires a minimum amount of .01 ether to enter', async () => {
    try {
      await raffle.methods.enter().send({
        from: manager,
        value: web3.utils.toWei('0.01', 'ether'),
      });
    } catch (error) {
      assert(false);
    }
  });

  it('only manager can pick a winner', async () => {
    try {
      await raffle.methods.enter().send({
        from: manager,
        value: web3.utils.toWei('0.01', 'ether'),
      });
      await raffle.methods.pickWinner().send({
        from: manager,
      });
    } catch (error) {
      assert(false);
    }
  });

  it('sends money to the winner and resets the raffle', async () => {
    const ticket = web3.utils.toWei('2', 'ether');
    await raffle.methods.enter().send({
      from: manager,
      value: ticket,
    });

    const initialBalance = await web3.eth.getBalance(manager);
    await raffle.methods.pickWinner().send({ from: manager });
    const finalBalance = await web3.eth.getBalance(manager);
    const prize = finalBalance - initialBalance;
    const players = await raffle.methods.getPlayers().call();

    assert.ok(ticket > prize);
    assert.equal(players.length, 0);
  });
});
