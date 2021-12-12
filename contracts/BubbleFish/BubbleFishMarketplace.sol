pragma solidity ^0.8.0;

import "./IBubbleFishMarketPlace.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BubbleFishMarketplace is IBubbleFishMarketPlace, Ownable {

    BubbleFishContract nftContractInstance; 

    struct Offer{
        address payable seller;
        uint256 price;
        uint256 tokenId;
        bool active;
    }
    struct OfferStates{
        uint256 index;
        bool onStorage;
    }
    uint256 activeOffersCont = 0;

    Offer[] offers;
    mapping(uint256 => bool) tokenIdToHasActiveOffer;
    mapping(uint256 => OfferStates) tokenIdToOfferState;
  
  function setBubbleFishContract(address _kittyContractAddress) override external onlyOwner {
    nftContractInstance = BubbleFishContract(_kittyContractAddress);
  }
  constructor(address _kittyContractAddress){
    nftContractInstance = BubbleFishContract(_kittyContractAddress);
  }

    /**
    * Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
     */
    function getOffer(uint256 _tokenId) override public view returns ( address seller, uint256 price, uint256 index, uint256 tokenId, bool active){
        active = tokenIdToHasActiveOffer[_tokenId];
        require(active,"token has no active offer");
        Offer storage offerPointer = offers[tokenIdToOfferState[_tokenId].index];
        seller = offerPointer.seller;
        price = offerPointer.price;
        index = tokenIdToOfferState[_tokenId].index;
        tokenId = offerPointer.tokenId;
    }

    function isOnSell(uint256 _tokenId) public view returns ( bool){
        return tokenIdToHasActiveOffer[_tokenId];
    }

    /**
    * Get all tokenId's that are currently for sale. Returns an empty arror if none exist.
     */
    function getAllTokenOnSale() override external view  returns(uint256[] memory listOfOffers){
        if(activeOffersCont == 0) listOfOffers = new uint256[](0);
        else {
            listOfOffers = new uint256[](activeOffersCont);
            uint256 i = 0;
            uint256 includedOfferCount = 0;
            uint256 totalOffers = offers.length;
            for(; i < totalOffers; ++i){
                if(offers[i].active){
                    listOfOffers[includedOfferCount] = offers[i].tokenId;
                    ++includedOfferCount;
                    if(includedOfferCount == activeOffersCont) break;
                }
            }
        }
    }

    /**
    * Creates a new offer for _tokenId for the price _price.
    * Emits the MarketTransaction event with txType "Create offer"
    * Requirement: Only the owner of _tokenId can create an offer.
    * Requirement: There can only be one active offer for a token at a time.
    * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
     */
    function setOffer(uint256 _price, uint256 _tokenId) override external{
        require(_ownsBubbleFish(msg.sender,_tokenId), "You don't own this token to offer it");
        require(tokenIdToHasActiveOffer[_tokenId] == false, "A offer already exist for the token");
        require (nftContractInstance.isApprovedForAll(msg.sender, address(this)), "marketplace must have allowance");
    
        if(tokenIdToOfferState[_tokenId].onStorage){
            Offer memory newOffer = Offer(payable(msg.sender), _price, _tokenId,true);
            tokenIdToHasActiveOffer[_tokenId] = true;
            offers[tokenIdToOfferState[_tokenId].index] = newOffer;
        }
        else {
            tokenIdToOfferState[_tokenId] = OfferStates(offers.length, true);
            Offer memory newOffer = Offer(payable(msg.sender), _price, _tokenId,true);
            tokenIdToHasActiveOffer[_tokenId] = true;
            offers.push(newOffer);
        }
        ++activeOffersCont;
        emit MarketTransaction("Create offer", msg.sender, _tokenId);
    }

    /**
    * Removes an existing offer.
    * Emits the MarketTransaction event with txType "Remove offer"
    * Requirement: Only the seller of _tokenId can remove an offer.
     */
    function removeOffer(uint256 _tokenId) override external{
       require(_ownsBubbleFish(msg.sender,_tokenId), "You don't own this token to offer it");
       require(tokenIdToHasActiveOffer[_tokenId] == true, "token doen't have active offer");
       //
       delete tokenIdToHasActiveOffer[_tokenId];
       offers[tokenIdToOfferState[_tokenId].index].active = false;
       --activeOffersCont;

       emit MarketTransaction("Cancel offer", msg.sender, _tokenId);
    }

    /**
    * Executes the purchase of _tokenId.
    * Sends the funds to the seller and transfers the token using transferFrom in Kittycontract.
    * Emits the MarketTransaction event with txType "Buy".
    * Requirement: The msg.value needs to equal the price of _tokenId
    * Requirement: There must be an active offer for _tokenId
     */
    function buyBubbleFish(uint256 _tokenId) override external payable{
        require(tokenIdToHasActiveOffer[_tokenId], "Token doesnt have an active offer");
        Offer storage offer = offers[tokenIdToOfferState[_tokenId].index];
        require(msg.value == offer.price,"The price is incorrect");
        
       delete tokenIdToHasActiveOffer[_tokenId];
       offers[tokenIdToOfferState[_tokenId].index].active = false;
       --activeOffersCont;

        nftContractInstance.safeTransferFrom(offer.seller, msg.sender, _tokenId);

        if(offer.price > 0) offer.seller.transfer(msg.value);
        
        emit MarketTransaction("Bought Token", msg.sender, _tokenId);
    }

    function _ownsBubbleFish(address _address, uint256 _tokenId) internal view returns (bool){
        return nftContractInstance.ownerOf(_tokenId) == _address;
    }
}