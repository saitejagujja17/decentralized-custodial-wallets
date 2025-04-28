PROJECT: Decentralized Custodial Wallet Models

This project explores and compares three decentralized custodial wallet mechanisms on Ethereum:
- Time-Locked Wallets
- Multisig Control (e.g., Gnosis Safe-style)
- Inheritance Protocols (e.g., Dead Man’s Switch)

Our goal is to evaluate these models based on security, usability, and user control, and to build a prototype for one (Time-Locked ETH Wallet).

Authors:
- Sai Teja Gujja – saiteja.gujja-1@ou.edu
- Vinaykrishna Mattela – vinaykrishna.mattela-1@ou.edu

Tech Stack:
- Solidity
- Hardhat
- React.js
- Ethers.js
- MetaMask
- Ethereum Sepolia Testnet

Folder Structure:
- contracts/
- frontend/
- reports/
- test/

Getting Started:

Install backend dependencies and run tests:
npm install
npx hardhat test

To run the React frontend:
cd frontend
npm install
npm start

Weekly Progress:

Week 1: Literature review, contract design

Week 2: Smart contract and testnet deployment
- Implemented TimeLockedWallet.sol
- Configured Hardhat with Sepolia network and Infura
- Set up .env for RPC URL and wallet private key
- Wrote and ran deploy.js script
- Deployed to Sepolia: 0x7559c7924f7512b058CFB7b4d7bBa3E22F95217b
- Verified on Sepolia Etherscan

Week 3: React frontend and integration
- Built React.js frontend to interact with deployed smart contract
- Integrated MetaMask wallet connection using ethers.js
- Displayed Unlock Time fetched from blockchain
- Implemented Deposit functionality to lock ETH
- Implemented Withdraw functionality after unlock time
- Successfully tested all blockchain interactions on Sepolia testnet

Week 4: Final demo, report, and video

Demo Video:
(To be added in Week 4)
