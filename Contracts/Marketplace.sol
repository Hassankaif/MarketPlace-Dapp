// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MarketPlace {
    struct ItemStruct {
        uint id;
        string name;
        uint price;
        address payable seller;
        address owner;
        bool isSold;
        string imageURI;
        bool isDelivered;
        bool isFundsReleased;
    }

    uint public itemcount = 0;
    mapping(uint => ItemStruct) public items;
    mapping(address => uint[]) public OwnedItems;
    mapping(uint => uint) public escrowBalances;

    event ItemListed(uint indexed id, string name, uint price, string imageURI);
    event ItemSold(uint indexed id, address buyer, uint price);
    event ItemDelivered(uint indexed id);
    event FundsReleased(uint indexed id, address seller, uint amount);

    function ListItemsForSale(string memory _name, uint _price, string memory _imageURI) public {
        require(_price > 0, "Price must be greater than zero");
        require(bytes(_imageURI).length > 0, "Image URI cannot be empty");
        
        itemcount++;
        items[itemcount] = ItemStruct(
            itemcount,
            _name,
            _price,
            payable(msg.sender),
            msg.sender,
            false,
            _imageURI,
            false,
            false
        );
        
        OwnedItems[msg.sender].push(itemcount);
        emit ItemListed(itemcount, _name, _price, _imageURI);
    }

    function _transferOwnerShip(uint _id, address _from, address _to) internal {
        ItemStruct storage Selected_item = items[_id];
        Selected_item.owner = _to;
        uint[] storage fromitems = OwnedItems[_from];
        
        for(uint i = 0; i < fromitems.length; i++) {
            if(fromitems[i] == _id) {
                fromitems[i] = fromitems[fromitems.length - 1];
                fromitems.pop();
                break;
            }
        }
        OwnedItems[_to].push(_id);
    }

    function PurchaseItem(uint _id) public payable {
        ItemStruct storage Selecteditem = items[_id];
        require(_id > 0, "INVALID ID");
        require(!Selecteditem.isSold, "Items Already Sold");
        require(msg.sender != Selecteditem.seller, "Seller Cannot Buy Their own Product");
        require(msg.value == Selecteditem.price, "Incorrect payment amount");

        Selecteditem.isSold = true;
        escrowBalances[_id] = msg.value;
        _transferOwnerShip(_id, Selecteditem.seller, msg.sender);
        
        emit ItemSold(_id, msg.sender, msg.value);
    }

    function confirmDelivery(uint _id) public {
        ItemStruct storage item = items[_id];
        require(msg.sender == item.owner, "Only buyer can confirm delivery");
        require(item.isSold, "Item not sold yet");
        require(!item.isDelivered, "Delivery already confirmed");
        
        item.isDelivered = true;
        emit ItemDelivered(_id);
        
        // Auto-release funds to seller after delivery confirmation
        releaseFunds(_id);
    }

    function releaseFunds(uint _id) internal {
        ItemStruct storage item = items[_id];
        require(item.isDelivered, "Delivery not confirmed yet");
        require(!item.isFundsReleased, "Funds already released");
        require(escrowBalances[_id] > 0, "No funds in escrow");

        uint amount = escrowBalances[_id];
        escrowBalances[_id] = 0;
        item.isFundsReleased = true;
        item.seller.transfer(amount);
        
        emit FundsReleased(_id, item.seller, amount);
    }


    function transferItemForFree(uint _id, address _to) public {
        ItemStruct storage selectItem = items[_id];
        require(_id > 0 && _id <= itemcount, "ITEM DOES NOT EXISTS");
        require(msg.sender == selectItem.owner, "you are not the owner of this product");
        _transferOwnerShip(_id, msg.sender, _to);
    }

    function getItemsByOwner(address _owner) public view returns (uint[] memory) {
        return OwnedItems[_owner];
    }
}