require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/QJgAIch7QZv0OeXGYj_zUzbBQ9cpIqYu', // put your alchemy api here
      accounts: [''], // put your wallet's private key here
    },
  },
};