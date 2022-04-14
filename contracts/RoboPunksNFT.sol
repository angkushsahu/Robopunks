// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoboPunksNFT is ERC721, Ownable {
    uint256 public mintPrice;  // minting price of a token
    uint256 public totalSupply;  // total minting tokens available
    uint256 public maxSupply;  // maximum number of NFTs in the collection
    uint256 public maxPerWallet;  // whether the users can mint token or not
    bool public isPublicMintEnabled;  // to determine where the images are located (for opensea)
    string internal baseTokenUri;  // withdraw the money that goes into this contract
    address payable public withdrawWallet;
    mapping(address => uint256) public walletMints;

    constructor() payable ERC721("RoboPunks", "RP") {
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
        // set withdraw wallet address
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
        baseTokenUri = _baseTokenUri;
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "Token does not exist");
        return string(abi.encodePacked(baseTokenUri, Strings.toString(_tokenId), ".json"));
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{ value: address(this).balance }("");
        require(success, "withdraw field");
    }

    function mint(uint256 _quantity) public payable {
        require(isPublicMintEnabled, "Minting not enabled");
        require(msg.value == _quantity * mintPrice, "Wrong mint value");
        require(totalSupply + _quantity <= maxSupply, "Sold out");
        require(walletMints[msg.sender] + _quantity <= maxPerWallet, "Exceeded max wallet");

        for (uint256 i = 0; i < _quantity; i ++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply ++;
            _safeMint(msg.sender, newTokenId);
        }
    }
}