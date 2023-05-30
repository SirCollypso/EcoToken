const { ethers } = require("hardhat");    

const main = async () => {
  const baseValueEth = ethers.utils.parseUnits("0.05", "ether");;
  const baseValueEcoToken = 1000;
  const rewardRate = 1;
  
  const ecoTokenFactory = await hre.ethers.getContractFactory("EcoToken");
  const ecoTokenContract = await ecoTokenFactory.deploy(baseValueEth, baseValueEcoToken, rewardRate);

  await ecoTokenContract.deployed();

  console.log("Transactions address: ", ecoTokenContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();