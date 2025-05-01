// frontend/src/VaultApp.js
import { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./walletConfig";
import "./VaultApp.css";

export default function VaultApp() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [ethAmount, setEthAmount] = useState("0");
  const [ethLabel, setEthLabel] = useState("");
  const [ethUnlockDate, setEthUnlockDate] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [lockedVaults, setLockedVaults] = useState([]);
  const [unlockedVaults, setUnlockedVaults] = useState([]);
  const [withdrawInputs, setWithdrawInputs] = useState({});
  const [countdowns, setCountdowns] = useState({});

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        const vaultContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(vaultContract);
      } catch (error) {
        alert("❌ Wallet connection failed: " + error.message);
      }
    } else {
      alert("⚠️ Please install MetaMask to use this app.");
    }
  }

  async function depositETH() {
    if (!contract || !ethAmount || !ethUnlockDate || !ethLabel || !beneficiary) {
      alert("❗ Please fill all fields before depositing.");
      return;
    }

    if (isNaN(ethAmount) || parseFloat(ethAmount) <= 0) {
      alert("❗ ETH amount must be a valid number greater than 0");
      return;
    }

    const unlockTime = Math.floor(new Date(ethUnlockDate).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    const unlockInSeconds = unlockTime - now;

    if (unlockInSeconds <= 0) {
      alert("Unlock time must be in the future.");
      return;
    }

    try {
      const tx = await contract.depositETH(
        ethLabel,
        unlockInSeconds,
        beneficiary,
        { value: ethers.parseEther(ethAmount) }
      );
      await tx.wait();
      alert("✅ ETH deposited successfully");
      setEthAmount("0");
      setEthLabel("");
      setEthUnlockDate("");
      setBeneficiary("");
      fetchVaults();
    } catch (err) {
      alert("❌ Deposit failed: " + (err?.info?.error?.message || err.message));
    }
  }

  async function fetchVaults() {
    if (!contract || !account) return;
    try {
      const data = await contract.getVaults(account);
      const now = Date.now() / 1000;
      const locked = data.filter(v => !v.withdrawn && now < Number(v.unlockTime));
      const unlocked = data.filter(v => !v.withdrawn && now >= Number(v.unlockTime));
      setLockedVaults(locked);
      setUnlockedVaults(unlocked);
    } catch (err) {
      console.error("Failed to fetch vaults:", err);
    }
  }

  useEffect(() => {
    if (contract && account) fetchVaults();
  }, [contract, account]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const newCountdowns = {};
      lockedVaults.forEach((v, i) => {
        const remaining = Number(v.unlockTime) - now;
        if (remaining > 0) {
          const h = Math.floor(remaining / 3600);
          const m = Math.floor((remaining % 3600) / 60);
          const s = remaining % 60;
          newCountdowns[i] = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        } else {
          newCountdowns[i] = "00h 00m 00s";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedVaults]);

  const handleWithdrawChange = (index, value) => {
    setWithdrawInputs(prev => ({ ...prev, [index]: value }));
  };

  async function withdraw(vaultId, maxAmount) {
    const inputAmount = withdrawInputs[vaultId];
    const parsedInput = parseFloat(inputAmount);
    const available = parseFloat(ethers.formatEther(maxAmount));

    if (!inputAmount || isNaN(parsedInput) || parsedInput <= 0) {
      alert("Enter a valid withdrawal amount greater than 0.");
      return;
    }
    if (parsedInput > available) {
      alert(`❌ You cannot withdraw more than available: ${available} ETH.`);
      return;
    }

    try {
      const tx = await contract.withdraw(vaultId, ethers.parseEther(inputAmount));
      await tx.wait();
      alert("✅ Withdrawal successful");
      fetchVaults();
    } catch (err) {
      alert("❌ Withdraw failed: " + err.message);
    }
  }

  const renderTable = (vaults, isUnlocked) => (
    <table className="vault-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Token</th>
          <th>Amount</th>
          <th>Unlock Time</th>
          <th>Label</th>
          <th>Beneficiary</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {vaults.map((v, i) => (
          <tr key={i}>
            <td>{i}</td>
            <td>{v.token === ethers.ZeroAddress ? "ETH" : v.token}</td>
            <td>{ethers.formatEther(v.amount)}</td>
            <td>
              {new Date(Number(v.unlockTime) * 1000).toLocaleString()}
              {!isUnlocked && <div style={{ fontSize: '0.9em', color: '#555' }}>{countdowns[i]}</div>}
            </td>
            <td>{v.label}</td>
            <td>{v.beneficiary}</td>
            <td>{v.withdrawn ? "✅ Withdrawn" : isUnlocked ? "🔓 Unlocked" : "🔒 Locked"}</td>
            <td>
              {isUnlocked && !v.withdrawn && (
                <>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={withdrawInputs[i] || ""}
                    onChange={e => handleWithdrawChange(i, e.target.value)}
                    style={{ width: "70px", marginRight: "5px" }}
                  />
                  <button onClick={() => withdraw(i, v.amount)} className="withdraw-button">Withdraw</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="vault-app">
      <h2>⏳ Advanced Custodial Vault</h2>

      {!account ? (
        <button onClick={connectWallet} className="connect-button">🔑 Connect Wallet</button>
      ) : (
        <div>
          <p className="connected">🔐 Connected as: {account}</p>

          <div className="deposit-form">
            <h3>💰 Deposit ETH</h3>
            <input placeholder="Label" value={ethLabel} onChange={(e) => setEthLabel(e.target.value)} />
            <input placeholder="ETH Amount" type="number" min="0" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
            <input placeholder="Unlock Time (yyyy-mm-dd hh:mm:ss)" type="datetime-local" value={ethUnlockDate} onChange={(e) => setEthUnlockDate(e.target.value)} />
            <input placeholder="Beneficiary Address" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} />
            <button onClick={depositETH}>Deposit</button>
          </div>

          <div className="vault-section">
            <h3>🔒 Locked Vaults</h3>
            {lockedVaults.length > 0 ? renderTable(lockedVaults, false) : <p>No locked vaults.</p>}

            <h3>🔓 Unlocked Vaults</h3>
            {unlockedVaults.length > 0 ? renderTable(unlockedVaults, true) : <p>No unlocked vaults.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
