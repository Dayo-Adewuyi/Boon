//implement deploy
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so NestcoinContract here is a factory for instances of our Nestcoin contract.
  */
 console.log("deploying Token contract.......")
    const TokenContract = await ethers.getContractFactory("Token");

    // here we deploy the contract
    const deployedTokenContract = await TokenContract.deploy();

    // Wait for it to finish deploying
  await deployedTokenContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 Token Contract Address is:",
    deployedTokenContract.address
  );

  

  console.log("\n 🏵 deploying Boon contract.......")
  const BoonContract = await ethers.getContractFactory("Boon")
  const deployedBoonContract = await BoonContract.deploy()

  // Wait for it to finish deploying
  await deployedBoonContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 Boon Contract Address is:",
    deployedBoonContract.address
  );

  



}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });