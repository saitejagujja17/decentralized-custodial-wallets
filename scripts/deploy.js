const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  const contract = await hre.ethers.deployContract("TimeLockedWallet", [
    deployer.address,
    unlockTime
  ]);

  await contract.waitForDeployment();
  console.log("TimeLockedWallet deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
