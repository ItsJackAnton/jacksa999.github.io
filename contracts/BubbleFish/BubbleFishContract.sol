pragma solidity ^0.8.0;

import "./IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC721Receiver.sol";

contract BubbleFishContract is IERC721, Ownable{  

    string public constant token_Name = "BubbleFish";
    string public constant token_Symbol = "BF";
    bytes4 internal constant ERC721_Receiver = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    
    mapping(uint => address) tokenToOwner; 
    mapping(address => uint) ownerCount;
    mapping(uint => address) tokenIndexToApproved;
    mapping(address => mapping (address=>bool)) _operatorApprovals;

    struct BubbleFish{
        uint256 genes;
        uint64 birthTime;
        uint256 mumId;
        uint256 dadId;
        uint256 generation;
    }
    BubbleFish[] bubbleFishes;
    uint16 GEN_0_LIMIT = 10;
    uint16 gen0Count;

    event Birth(address owner,
                uint256 tokenId,
                uint256 mumId,
                uint256 dadId, 
                uint256 genes,
                uint256 generation);

    modifier HasToken(uint tokenId){
        require(msg.sender == tokenToOwner[tokenId]);
        _;
    } 

    function supportInterface(bytes4 _interfaceId) external pure returns (bool){
        return _interfaceId == _INTERFACE_ID_ERC165|| _interfaceId == _INTERFACE_ID_ERC721;
    }

    function getToken(uint _tokenId) public view returns(
        uint _genes,
        uint _birthTime,
        uint _mumId,
        uint _dadId,
        uint _generation){
        BubbleFish storage _bubbleFish = bubbleFishes[_tokenId];
        _genes = _bubbleFish.genes;
        _birthTime = uint256(_bubbleFish.birthTime);
        _mumId = uint256(_bubbleFish.mumId);
        _dadId = uint256(_bubbleFish.dadId);
        _generation = uint256(_bubbleFish.generation); 
    }

    function createTokenGen0(uint _genes) public onlyOwner returns(uint256){
        require(gen0Count < GEN_0_LIMIT);
        ++gen0Count;
        return _createToken(_genes,0,0,0, owner());
    }
    uint256 prevUsedGenes;
    function getPrevUsedGenes() external view returns(uint){
        return prevUsedGenes;
    }
    function _createToken(
        uint256 _genes,
        uint256 _mumId, 
        uint256 _dadId, 
        uint256 _generation,
        address _owner
    ) public returns (uint256) {
        uint newId = bubbleFishes.length;
        BubbleFish memory bubblelish = BubbleFish({genes: _genes, birthTime : uint64(block.timestamp), mumId: _mumId, dadId: _dadId, generation: _generation});
        bubbleFishes.push(bubblelish);
        _transfer(address(0), _owner, newId);
        prevUsedGenes = _genes;
        emit Birth(_owner, newId, _mumId, _dadId, _genes, _generation);
        return newId;
    }

    function balanceOf(address owner) override external view returns (uint256 balance){
        return ownerCount[owner];
    }
 
    function totalSupply() override external view returns (uint256 total){
        return bubbleFishes.length;
    }
 
    function name() override external pure returns (string memory tokenName){
        tokenName = token_Name;
    }
 
    function symbol() override external pure returns (string memory tokenSymbol){
        tokenSymbol = token_Symbol;
    } 

    function ownerOf(uint256 tokenId) override external view returns (address owner){
        owner = tokenToOwner[tokenId];
    }
 
    function transfer(address to, uint256 tokenId) override external HasToken(tokenId){
        require(to != address(0));
        require(to != address(this)); 
        _transfer(msg.sender, to, tokenId);
    }
    function _transfer(address from, address to, uint256 tokenId) public{
         ++ownerCount[to]; 
        tokenToOwner[tokenId] = to;

        if(from != address(0)){
            --ownerCount[from];
            delete tokenIndexToApproved[tokenId];
        }
        emit Transfer(from, to, tokenId);
    }
    function hasToken(address _from, uint _tokenId) public view returns (bool)
    {
        require(bubbleFishes.length > _tokenId, "index out of range at (hasItem)");
        return tokenToOwner[_tokenId] == _from;  
    }

    //
    function approve(address _approved, uint _tokenId) override public  {
        require(hasToken(msg.sender,_tokenId), "you must own the token!"); 
        tokenIndexToApproved[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
    function setApprovalForAll(address _operator, bool _approved) override public  {   
        require(_operator != msg.sender, "you can not make yourself a operator!");
        _operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }
    function getApproved(uint _tokenId) override public view returns (address){
        require(bubbleFishes.length > _tokenId, "index out of range at (hasItem)");
        return tokenIndexToApproved[_tokenId];
    }
    function isApprovedForAll(address _from, address _operator) override public view returns (bool){
        return _operatorApprovals[_from][_operator];
    }

    function getTokensByOwner(address _owner) external view returns (uint[] memory){
        uint[] memory ids = new uint[](ownerCount[_owner]);
        uint count = 0;

        for (uint i; i < bubbleFishes.length; ++i){
            if(tokenToOwner[i] == _owner){
                ids[count] = i;
                ++count;
            }
        }
        return ids;
    }

    // 
    function _safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) internal{
        _transfer(_from, _to, _tokenId);
        require(_checkERC721Support(_from, _to, _tokenId, data), "address doesnt support ERC721");
    }
        function safeTransferFrom(address _from, address _to, uint256 _tokenId) override external {
        safeTransferFrom(_from, _to, _tokenId, "");
    }
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) override public{ 
        require(_isApprovedOrOwner(msg.sender, _from, _to, _tokenId), "You are not approved to transfer token");

        _safeTransferFrom(_from, _to, _tokenId, data);
    }
    function _isApprovedOrOwner(address _spender, address _from, address _to, uint256 _tokenId) internal view returns (bool){ 
        require(_to != address(0), "to is address 0");
        require(hasToken(_from, _tokenId), "from doesn't have the token");

        return msg.sender == _from || _approvedFor(_spender,_tokenId) || isApprovedForAll(_from, _spender);
    }
    function transferFrom(address _from, address _to, uint256 _tokenId) override external
    {
        require(_to != address(0), "receiver must not be address 0");
        //require(_to != address(this), "receiver must not be the contract");
        require(_isApprovedOrOwner(msg.sender, _from, _to, _tokenId)); 

        _transfer(_from, _to, _tokenId);
    }

    function _approvedFor(address _receiver, uint _tokenId)  public view returns (bool){
        return tokenIndexToApproved[_tokenId] == _receiver;
    } 

    function _checkERC721Support(address _from, address _to, uint256 _tokenId, bytes memory data) internal view returns (bool){
        if(!_isContract(_to)) {
            return true;
        }
        bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, data);
        return ERC721_Receiver == returnData;
    }

    function _isContract(address _to) internal view returns (bool){
        uint32 size;
        assembly{
            size := extcodesize(_to)
        }
        return size > 0;
    }

    //
    function breed(uint256 _dadId, uint256 _mumId) public returns (uint256){
        require(hasToken(msg.sender, _dadId), "you do not own dad Token");
        require(hasToken(msg.sender, _mumId), "you do not own mum Token");

        (uint256 _dadDna,,,,uint256 _dadGen) = getToken(_dadId);
        (uint256 _mumDna,,,,uint256 _mumGen) = getToken(_mumId);
        uint256 newDna = _mixDna(_dadDna, _mumDna);
        uint256 newGen = _compureGeneration(_dadGen, _mumGen);

        return _createToken(newDna,_dadId,_mumId,newGen,msg.sender);
    }
    function _mixDna(uint256 _dadDna, uint256 _mumDna) private view returns (uint256){
        // uint256 firstHalf = _dadDna / 100000000;
        // uint256 secondHalf = _mumDna % 100000000;
        // firstHalf *= 100000000; 
        // return firstHalf + secondHalf;

        uint8 randNum = uint8(block.timestamp % 255);
        uint256 i = 1;
        uint256 index = 1;

        uint256 newDna;
        for (; i < 512; i *= 2) { 

            if(randNum & i != 0){
                newDna += uint8(_mumDna % 100) * index; 
            }
            else{
                newDna += uint8(_dadDna % 100) * index; 
            }
            _mumDna /= 100;
            _dadDna /= 100;

            index *= 100;
        } 
        return newDna;
    }
    function _compureGeneration(uint256 _dadGen, uint256 _mumGen)private pure returns (uint256){
        return _dadGen > _mumGen? _dadGen + 1: _mumGen + 1;
    }
}