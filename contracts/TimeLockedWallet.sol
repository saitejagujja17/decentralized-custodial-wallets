// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TimeLockedWallet {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public unlockTimes;

    function depositWithUnlock(uint256 unlockAfterSeconds) public payable {
        require(msg.value > 0, "Must send ETH");
        uint256 unlockAt = block.timestamp + unlockAfterSeconds;
        balances[msg.sender] += msg.value;
        unlockTimes[msg.sender] = unlockAt;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "No balance to withdraw");
        require(block.timestamp >= unlockTimes[msg.sender], "Funds are still locked");

        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        unlockTimes[msg.sender] = 0;

        payable(msg.sender).transfer(amount);
    }

    function getUnlockTime(address user) public view returns (uint256) {
        return unlockTimes[user];
    }
}
