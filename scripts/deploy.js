const hre = require("hardhat");

async function main() {
  const Vault = await hre.ethers.getContractFactory("AdvancedTimeVault2");
  const contract = await Vault.deploy();
  await contract.waitForDeployment();
  console.log("AdvancedTimeVault2 deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
