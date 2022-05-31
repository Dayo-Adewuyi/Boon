// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Token.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Boon is Ownable, Pausable {
    constructor() {}

    IERC20 public token;
    event Airdrop(address indexed from, address indexed to, uint value);

    function airdrop(
        address _token,
        address[] calldata _address,
        uint256[] calldata _rewards
    ) external {
        token = IERC20(_token);
        require(token.balanceOf(msg.sender) > 0, "get more tokens");
        require(
            _address.length == _rewards.length,
            "beneficiaries and token length must be equal."
        );

        for (uint i = 0; i < _address.length; i++) {
            uint256 userRewards = _rewards[i] * 10**18;

            token.transferFrom(msg.sender, _address[i], userRewards);

            emit Airdrop(msg.sender, _address[i], userRewards);
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
