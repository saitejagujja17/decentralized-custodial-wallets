// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TimeLockedWallet {
    address public owner;
    address public beneficiary;
    uint256 public unlockTime;

    constructor(address _beneficiary, uint256 _unlockTime) payable {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        owner = msg.sender;
        beneficiary = _beneficiary;
        unlockTime = _unlockTime;
    }

    function withdraw() public {
        require(msg.sender == beneficiary, "Only the beneficiary can withdraw");
        require(block.timestamp >= unlockTime, "Funds are still locked");

        payable(beneficiary).transfer(address(this).balance);
    }

    function deposit() public payable {}

    receive() external payable {}
}
