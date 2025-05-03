Project: Time-Locked Ethereum Wallet for Kids Using Smart Contracts

Authors
Sai Teja Gujja – saiteja.gujja-1@ou.edu
Vinaykrishna Mattela – vinaykrishna.mattela-1@ou.edu

This project explores and compares three decentralized custodial wallet mechanisms on Ethereum:
- Time-Locked Wallets
- Multisig Control (e.g., Gnosis Safe–style)
- Inheritance Protocols (e.g., Dead Man’s Switch)

Our goal is to evaluate these models based on security, usability, and user control, and to build a working prototype for one of them (Time-Locked ETH Wallet).

Tech Stack

Solidity
Hardhat
React.js
Ethers.js
MetaMask
Ethereum Sepolia Testnet

Folder Structure

contracts/ - All Solidity contracts

frontend/ - React DApp source

reports/ - Literature reviews & project reports

scripts/ - Hardhat deployment & utility scripts

test/ - Contract unit tests

Getting Started

Prerequisites:
- Node.js v16+ & npm
- Hardhat
- MetaMask

Install & Test:
```bash
npm install
npx hardhat test
```

Deploy to Sepolia:
- Add .env with SEPOLIA_RPC_URL and PRIVATE_KEY
```bash
npx hardhat compile
npx hardhat run --network sepolia scripts/deploy.js
```
After deployment

1.Open frontend/src/walletConfig.js and update the CONTRACT_ADDRESS constant to your newly-deployed contract address.

2.Open artifacts/contracts/AdvancedTimeVault2.sol/AdvancedTimeVault2.json, copy its abi array, and paste it over the CONTRACT_ABI in frontend/src/walletConfig.js.

Run Frontend:
```bash
cd frontend
npm install
npm start
```
Weekly Progress

Week 1: Literature review & contract design

Week 2: Smart-contract implementation & Sepolia deployment

Week 3: React frontend development & integration

Week 4: Final demo, performance report, and video recording
