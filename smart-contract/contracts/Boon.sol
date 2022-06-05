// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "./Token.sol";
import "./NFT.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Boon is Ownable, Pausable {
    constructor() {}

    IERC20 public token;
    IERC721 public nft;
    event Airdrop(address indexed from, address indexed to, uint value);

    function airdrop(
        address _token,
        address[] calldata _address,
        uint256[] calldata _rewards
    ) external whenNotPaused{
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

        function nftdrop(
        address _nft,
        address[] calldata _address,
        uint256[] calldata tokenId
    ) external whenNotPaused{
        nft = IERC721(_nft);
        require(nft.balanceOf(msg.sender) > 0, "get more tokens");
        require(
            _address.length == tokenId.length,
            "beneficiaries and token length must be equal."
        );

        for (uint i = 0; i < _address.length; i++) {
            
            nft.safeTransferFrom(msg.sender, _address[i], tokenId[i]);

            emit Airdrop(msg.sender, _address[i], tokenId[i]);
        }
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
