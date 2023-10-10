// SPDX-License-Identifier: MIT
pragma solidity >0.7.0;

contract sber{
    struct User {
        string name;
        // uint role;
    }

    struct Transfer {
        address recipient;
        address sender;
        uint amount;
        bool status_accept;
        bool end_transfer;
        bytes32 code_word;
    }

    mapping (address => User) users;

    Transfer[] public transfers;

    constructor () {
        users[0x5B38Da6a701c568545dCfcB03FcB875f56beddC4] = User("Belyaev Semyon Sergeevich");
        users[0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2] = User ("Shuklin Danila Sergeevich");
    }

    function send_money(address _recipient, bytes32 _code_word) public payable{
        require(msg.value > 0, "Insufficient funds");
        require(msg.sender != _recipient, "This translation is not meant for you.");

        transfers.push(Transfer(_recipient, msg.sender, msg.value, false, false, _code_word));
    }

    function accept_the_transfer(bytes32 _code_word, uint _id) public payable{
        require(transfers[_id].end_transfer == false, "The transaction has already been completed");
        require(msg.sender == transfers[_id].recipient, "This translation is not for you");

        if (transfers[_id].code_word == _code_word) {
            transfers[_id].status_accept = true;
            payable(msg.sender).transfer(transfers[_id].amount);
            transfers[_id].end_transfer = true;
        } else {
            payable(transfers[_id].sender).transfer(transfers[_id].amount);
            transfers[_id].end_transfer = true;
        }
    }

    function refuse_transfer_sender ( uint _id) public {
        require(msg.sender == transfers[_id].sender, "This translation is not for you");
        require(transfers[_id].end_transfer == false, "The transaction has already been completed");

        payable(transfers[_id].sender).transfer(transfers[_id].amount);
        transfers[_id].end_transfer = true;
    }

    function get_transfers() public returns(Transfer[] memory) {
        return transfers;
    }
}