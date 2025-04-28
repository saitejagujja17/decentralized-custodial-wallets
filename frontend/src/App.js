import { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./walletConfig";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [unlockTime, setUnlockTime] = useState(null);
  const [amount, setAmount] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const newProvider = new BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await newProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(newContract);
        setProvider(newProvider);

        console.log("Connected address:", address);
      } catch (err) {
        console.error("Error connecting:", err);
      }
    } else {
      alert("Please install MetaMask to use this app.");
    }
  }

  async function getUnlockTime() {
    if (contract) {
      try {
        const time = await contract.unlockTime();
        const readableTime = new Date(Number(time) * 1000).toLocaleString();
        setUnlockTime(readableTime);
      } catch (err) {
        console.error("Error fetching unlock time:", err);
      }
    }
  }

  async function depositETH() {
    if (contract && amount) {
      try {
        const tx = await contract.deposit({ value: ethers.parseEther(amount) });
        await tx.wait();
        alert("Deposit successful!");
      } catch (err) {
        console.error("Error depositing ETH:", err);
      }
    }
  }

  async function withdrawETH() {
    if (contract) {
      try {
        const tx = await contract.withdraw();
        await tx.wait();
        alert("Withdraw successful!");
      } catch (err) {
        console.error("Error withdrawing ETH:", err);
      }
    }
  }

  useEffect(() => {
    if (contract) {
      getUnlockTime();
    }
  }, [contract]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Decentralized Custodial Wallet</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask Wallet</button>
      ) : (
        <div>
          <p>✅ Connected Wallet: {account}</p>
          <p>🔒 Unlock Time: {unlockTime ? unlockTime : "Fetching..."}</p>

          <div style={{ marginTop: "20px" }}>
            <h3>Deposit ETH</h3>
            <input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={depositETH}>Deposit</button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Withdraw ETH</h3>
            <button onClick={withdrawETH}>Withdraw</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
