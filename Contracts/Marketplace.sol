// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MarketPlace{

    struct ItemStruct{
        uint id;
        string name;
        uint price;
        address payable seller;
        address owner;
        bool isSold;
    }

    uint  public  itemcount =0 ;
    mapping (uint=> ItemStruct) public items;
    mapping (address=>uint[]) public OwnedItems;


    function ListItemsForSale(string memory _name, uint _price) public {
        require(_price>0, "Price must greater than zero");
        itemcount++;
        items[itemcount]= ItemStruct(itemcount,_name,_price, payable(msg.sender), msg.sender, false);
        OwnedItems[msg.sender].push(itemcount);
    }


    function _transferOwnerShip(uint _id, address _from, address _to) internal  {
        ItemStruct storage Selected_item =items[_id];
        Selected_item.owner= _to ; //transfer ownership to _toAddress
        uint[] storage fromitems = OwnedItems[_from]; //contains all items of sender, need to remove the sold item from him/her
        
        //remove item from prevous owner item list
        for(uint i=0; i < fromitems.length; i++){
            if(fromitems[i] == _id){
                fromitems[i]=fromitems[fromitems.length -1];
                fromitems.pop();
                break ;
            }
        }
        //add items to new owner's List
        OwnedItems[_to].push(_id);
    }


    function PurchaseItem(uint _id) public payable {
        ItemStruct storage Selecteditem =items[_id];
        require(_id > 0, "INVALID ID");
        require(!Selecteditem.isSold,"Items Already Sold Dude");
        require(msg.sender != Selecteditem.seller, "Seller Cannot Buy Their own Product/ Items");

        Selecteditem.isSold=true; //marking item sold
        Selecteditem.seller.transfer(msg.value); // sending money to seller account
        _transferOwnerShip(_id, Selecteditem.seller, msg.sender); //transfering item ownership to receipent
    }

    function transferItemForFree(uint _id, address _to) public{ //transferring items without transferring any ethers
        ItemStruct storage selectItem =items[_id];
        require(_id>0 && _id<= itemcount, "ITEM DOES NOT EXISTS");
        require(msg.sender == selectItem.owner, "you are not the owner of this product");
        _transferOwnerShip(_id, msg.sender, _to);
    }

    function getItemsByOwner(address _owner) public view returns (uint[] memory){
        return  OwnedItems[_owner];
    }
}
