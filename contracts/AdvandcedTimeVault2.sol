// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function transfer(address recipient, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract AdvancedTimeVault2 {
    struct Vault {
        uint256 amount;
        address token;
        uint256 unlockTime;
        string label;
        address beneficiary;
        bool withdrawn;
    }

    mapping(address => Vault[]) public userVaults;

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

        uint unlockAt = block.timestamp + unlockAfterSeconds;

        userVaults[beneficiary].push(Vault({
            amount: msg.value,
            token: address(0),
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
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint unlockAt = block.timestamp + unlockAfterSeconds;

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

    function getVaults(address user) external view returns (Vault[] memory) {
        return userVaults[user];
    }

    function withdraw(uint vaultId, uint withdrawAmount) external {
        require(vaultId < userVaults[msg.sender].length, "Invalid vault ID");

        Vault storage v = userVaults[msg.sender][vaultId];

        require(msg.sender == v.beneficiary, "Only beneficiary can withdraw");
        require(!v.withdrawn, "Already withdrawn");
        require(block.timestamp >= v.unlockTime, "Still locked");
        require(withdrawAmount > 0 && withdrawAmount <= v.amount, "Invalid amount");

        v.amount -= withdrawAmount;
        if (v.amount == 0) {
            v.withdrawn = true;
        }

        if (v.token == address(0)) {
            payable(msg.sender).transfer(withdrawAmount); // send ETH to beneficiary
        } else {
            require(IERC20(v.token).transfer(msg.sender, withdrawAmount), "Token transfer failed");
        }

        emit Withdrawn(msg.sender, vaultId);
    }
}
