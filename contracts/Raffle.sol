pragma solidity ^0.4.17;


contract Raffle {
    address public manager;
    address[] public players;

    function Raffle() public {
        manager = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value >= .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(block.difficulty, block.timestamp, players));
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        address winner = players[index];
        winner.transfer(this.balance);
        players = new address[](0);
    }
}
