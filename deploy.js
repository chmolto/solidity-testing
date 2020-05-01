const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const endPoint = 'https://rinkeby.infura.io/v3/e212f785635c47e5a092681afd016205';
const neumonic = 'virus lake parrot prison swift crystal original pull envelope lawsuit reflect atom';
const provider = new HDWalletProvider(neumonic, endPoint);
const web3 = new Web3(provider);

// RAFFLE CONTRACT DEPLOY
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from', accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({
      gas: '1000000',
      from: accounts[0],
    });
  console.log(result.options.address);
};
deploy();

// INBOX CONTRACT DEPLOY
/* const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from', accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ['Weed'],
    })
    .send({
      gas: '1000000',
      from: accounts[0],
    });
  console.log(result.options.address);
};
deploy(); */
