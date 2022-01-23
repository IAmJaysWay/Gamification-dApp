pragma solidity ^0.8.3;

import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public owner;


    constructor() ERC721("GamifyMages", "MAGE") {
        owner = msg.sender;
    }

    function createToken() public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        string memory tokenURI = "https://ipfs.moralis.io:2053/ipfs/QmTBFrmexeAHbBMgrD81NXRretDAu9MHj5mfqW8rDm5ssf/metadata/2.json";

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
