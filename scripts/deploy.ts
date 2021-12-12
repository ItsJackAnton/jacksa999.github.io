import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

// const main = async (): Promise<any> => {
//   const Coin: ContractFactory = await ethers.getContractFactory("ExampleERC20");
//   const coin: Contract = await Coin.deploy();

//   await coin.deployed();
//   console.log(`Coin deployed to: ${coin.address}`);

//   const NFT: ContractFactory = await ethers.getContractFactory("NFT");
//   const nft: Contract = await NFT.deploy();

//   await nft.deployed();
//   console.log(`NFT deployed to: ${nft.address}`);
// };

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
const main = async (): Promise<any> => {
  const BubbleFishContract: ContractFactory = await ethers.getContractFactory(
    "BubbleFishContract"
  );
  const bubbleFishContract: Contract = await BubbleFishContract.deploy();

  await bubbleFishContract.deployed();
  console.log(`BubbleFishContract deployed to: ${bubbleFishContract.address}`);

  const BubbleFishMarketplace: ContractFactory =
    await ethers.getContractFactory("BubbleFishMarketplace");
  const bubbleFishMarketplace: Contract = await BubbleFishMarketplace.deploy(
    bubbleFishContract.address
  );

  await bubbleFishMarketplace.deployed();
  console.log(
    `BubbleFishMarketplace deployed to: ${bubbleFishMarketplace.address}`
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
