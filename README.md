# Project: Time-Locked Ethereum Wallet for Kids Using Smart Contracts

## Introduction & Motivation

This project introduces a decentralized custodial wallet designed for parents or guardians to deposit ETH on behalf of children. Inspired by traditional trust funds, the system enforces time-based restrictions using Ethereum smart contracts, ensuring that funds can only be withdrawn after a predefined unlock date.

Unlike centralized custodians, this system guarantees transparency, immutability, and autonomy through smart contracts. It also includes a comparative analysis of other custodial mechanisms like multisig wallets and inheritance protocols, evaluating trade-offs in usability, security, and long-term utility.

---

##  Folder Structure

```
DECENTRALIZED-CUSTODIAL-WALLETS/
│
├── contracts/                       # Solidity contracts
│   └── AdvancedTimeVault2.sol      # Main smart contract with ETH vault logic
│
├── scripts/                         # Deployment scripts
│   └── deploy.js                   # Hardhat deployment file
│
├── artifacts/                       # ABI, bytecode, and contract build artifacts
│   └── contracts/
│       └── AdvancedTimeVault2.json # ABI used in frontend
│
├── frontend/                        # Frontend React application
│   ├── public/                      # Static files and HTML template
│   └── src/
│       ├── components/              # Reusable UI components (if modularized)
│       ├── VaultApp.css             # CSS stylesheets
│       ├── walletConfig.js         # Contract address + ABI
│       └── VaultApp.js             # Main application logic
│
├── test/                            # Hardhat test cases (optional)
│   └── sample-test.js
│
├── .env                             # Environment config (PRIVATE_KEY, INFURA_URL)
├── .gitignore
├── hardhat.config.js                # Hardhat settings for Sepolia
├── package.json                     # Project dependencies
└── README.md                        # Project documentation (this file)

```

---

##  Pre-Requisites

Make sure you have:

-  Node.js (v16+)
-  Git
-  MetaMask browser extension
-  Hardhat (`npx hardhat`)
-  Infura or Alchemy RPC endpoint for Sepolia
-  ETH on Sepolia testnet (get from [Sepolia faucet](https://sepoliafaucet.com/))

---

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/saitejagujja17/timelock-wallet-For-kids.git
cd DECENTRALIZED-CUSTODIAL-WALLETS
```

---

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```
OR(if you're using Alchemy):
```
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
```

Install dependencies:

```bash
npm install
```

---

### 3. Compile & Deploy Smart Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

-  Copy the deployed **contract address** from the console.
-  Copy the **ABI** from `artifacts/contracts/AdvancedTimeVault2.json`.

---

### 4. Set Up Frontend

```bash
cd frontend
npm install
```

Paste your **contract address** and **ABI** in `src/walletConfig.js`:

```js
export const CONTRACT_ADDRESS = "your_contract_address";
export const CONTRACT_ABI = [/* Paste ABI here */];
```

---

### 5. Start Frontend Locally

```bash
npm start
```

Open in browser:  
 `http://localhost:3000`

---

##  Features

-  Time-locked ETH deposits for children
-  Beneficiary account support
-  Countdown timer to unlock
-  Secure withdrawals after unlock
-  User-friendly React frontend with MetaMask
-  Real-time transaction logging on Sepolia

---

##  Authors

| Name                 | Email                              | Role       |
|----------------------|------------------------------------|------------|
| **Sai Teja Gujja**   | saiteja.gujja-1@ou.edu             | Frontend + Integration |
| **Vinaykrishna Mattela** | vinaykrishna.mattela-1@ou.edu | Smart Contract + Backend |

University of Oklahoma, Norman, OK  
May 2025

---

## 📹 Demo Video

[Demo Video Link]()  


---
