// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address payable[] public participants;
    address public lastWinner;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether, "Minimum 0.01 ETH required to enter");

        participants.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp,
                        participants
                    )
                )
            );
    }

    function pickWinner() public restricted {
        require(participants.length > 2, "Not enough participants");

        uint index = random() % participants.length;
        lastWinner = participants[index];
        lastWinner.transfer(address(this).balance);

        // Reset the lottery for the next round
        participants = new address payable[](0);
    }

    function getLastWinner() public view returns (address) {
        return lastWinner;
    }

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can pick a winner");
        _;
    }

    function getParticipants() public view returns (address payable[] memory) {
        return participants;
    }
}
