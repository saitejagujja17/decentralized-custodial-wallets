// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Interface to interact with ERC20 tokens
interface IERC20 {
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function transfer(address recipient, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract AdvancedTimeVault2 {
    // Structure representing each vault
    struct Vault {
        uint256 amount;         // Amount of ETH or ERC20 tokens
        address token;          // Address of token (zero for ETH)
        uint256 unlockTime;     // UNIX timestamp when funds unlock
        string label;           // Label/description for vault (e.g., "Savings for child")
        address beneficiary;    // Who can withdraw funds after unlock time
        bool withdrawn;         // Flag to track if the vault is emptied
    }
    
    // Mapping of user address to their list of vaults
    mapping(address => Vault[]) public userVaults;

    // Events to log deposit and withdrawal activities
    event Deposited(address indexed user, uint vaultId, address token, uint amount, uint unlockTime, string label);
    event Withdrawn(address indexed user, uint vaultId);

    // ETH deposit with label, unlock time, and beneficiary
    function depositETH(
        string calldata label,
        uint256 unlockAfterSeconds,
        address beneficiary
    ) external payable {
        require(msg.value > 0, "No ETH sent");
        require(beneficiary != address(0), "Invalid beneficiary");

        // Calculate absolute unlock time
        uint unlockAt = block.timestamp + unlockAfterSeconds;

        // Add vault to beneficiary's list
        userVaults[beneficiary].push(Vault({
            amount: msg.value,
            token: address(0),// ETH indicated by zero address
            unlockTime: unlockAt,
            label: label,
            beneficiary: beneficiary,
            withdrawn: false
        }));

        emit Deposited(beneficiary, userVaults[beneficiary].length - 1, address(0), msg.value, unlockAt, label);
    }

    // ERC20 deposit with label, unlock time, and beneficiary
    function depositToken(
        address token,
        uint amount,
        string calldata label,
        uint256 unlockAfterSeconds,
        address beneficiary
    ) external {
        require(amount > 0, "No tokens sent");
        require(beneficiary != address(0), "Invalid beneficiary");
        // Transfer tokens to this contract
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Calculate unlock time
        uint unlockAt = block.timestamp + unlockAfterSeconds;

        // Add token vault
        userVaults[beneficiary].push(Vault({
            amount: amount,
            token: token,
            unlockTime: unlockAt,
            label: label,
            beneficiary: beneficiary,
            withdrawn: false
        }));

        emit Deposited(beneficiary, userVaults[beneficiary].length - 1, token, amount, unlockAt, label);
    }

    // Returns all vaults associated with a user
    function getVaults(address user) external view returns (Vault[] memory) {
        return userVaults[user];
    }

    // Allows beneficiary to withdraw funds from a vault if unlocked
    function withdraw(uint vaultId, uint withdrawAmount) external {
        require(vaultId < userVaults[msg.sender].length, "Invalid vault ID");

        Vault storage v = userVaults[msg.sender][vaultId];

        require(msg.sender == v.beneficiary, "Only beneficiary can withdraw");
        require(!v.withdrawn, "Already withdrawn");
        require(block.timestamp >= v.unlockTime, "Still locked");
        require(withdrawAmount > 0 && withdrawAmount <= v.amount, "Invalid amount");

        // Subtract the withdrawn amount from the vault
        v.amount -= withdrawAmount;
        // Mark vault as fully withdrawn if emptied
        if (v.amount == 0) {
            v.withdrawn = true;
        }

        // Send ETH or ERC20 to the beneficiary
        if (v.token == address(0)) {
            payable(msg.sender).transfer(withdrawAmount); // send ETH to beneficiary
        } else {
            require(IERC20(v.token).transfer(msg.sender, withdrawAmount), "Token transfer failed");
        }

        emit Withdrawn(msg.sender, vaultId);
    }
}
