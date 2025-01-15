import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Contractjson from "../build/contracts/MarketPlace.json";
import { Button, TextInput, Card, Badge } from 'flowbite-react';

const App = () => {
  const ContactAddress = "0x5F83D3E597Bb549FaFFa19A7f3364Ac9fDc97c21";
  const ContractABI = Contractjson.abi;

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      } else {
        console.error("MetaMask is not installed.");
      }
    };
    initProvider();
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccounts(accounts[0]);

      const signer = provider.getSigner();
      setSigner(signer);

      const contract = new ethers.Contract(ContactAddress, ContractABI, signer);
      setContract(contract);

      await LoadItems(contract);
      await LoadOwnedItems(contract, accounts[0]);

      // Listen for account changes
      window.ethereum.on("accountsChanged", async (newAccounts) => {
        setAccounts(newAccounts[0]);
        const updatedSigner = provider.getSigner();
        const updatedContract = new ethers.Contract(ContactAddress, ContractABI, updatedSigner);
        setSigner(updatedSigner);
        setContract(updatedContract);

        await LoadItems(updatedContract);
        await LoadOwnedItems(updatedContract, newAccounts[0]);
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const LoadItems = async (contract) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const itemCount = await contract.itemcount();
      const items = [];
      for (let i = 1; i <= itemCount; i++) {
        const item = await contract.items(i);
        items.push(item);
      }
      setItems(items);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const LoadOwnedItems = async (contract, owner) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const ownedItemsIDs = await contract.getItemsByOwner(owner);
      const ownedItems = [];
      for (let i = 0; i < ownedItemsIDs.length; i++) {
        const myItem = await contract.items(ownedItemsIDs[i]);
        ownedItems.push(myItem);
      }
      setOwnedItems(ownedItems);
    } catch (error) {
      console.error("Error loading owned items:", error);
    }
  };

  const ListItems = async (name, price) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.ListItemsForSale(
        name,
        ethers.utils.parseEther(price)
      );
      await tx.wait();
      await LoadItems(contract);
    } catch (error) {
      console.error("Error listing item:", error);
    }
  };

  const purchaseItem = async (id, price) => {
    try {
      const tx = await contract.PurchaseItem(id, {
        value: ethers.utils.parseEther(price),
      });
      await tx.wait();
      LoadItems(contract);
      LoadOwnedItems(contract, accounts);
    } catch (error) {
      console.error("Error purchasing item:", error);
    }
  };

  const transferItem = async (id, toAddress) => {
    try {
      const tx = await contract.transferItemForFree(id, toAddress);
      await tx.wait();
      LoadItems(contract);
      LoadOwnedItems(contract, accounts);
    } catch (error) {
      console.error("Error transferring item:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 ">
      {/* Header */}
      <div className="py-8 px-4 bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-extrabold text-purple-800">
              Decentralized Marketplace
            </h1>
            <Badge color="purple" size="lg" className="px-4 py-2">
              <Button onClick={connectWallet}>
                {accounts ? `Connected: ${accounts.substring(0, 6)}...${accounts.slice(-4)}` : "Connect Wallet"}
              </Button>
            </Badge>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* List Item Form */}
        <Card className="mb-12">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">List New Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
              <TextInput
                type="number"
                placeholder="Price in ETH"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              />
            </div>
            <Button 
              gradientDuoTone="purpleToPink"
              className="mt-6"
              onClick={() => ListItems(newItem.name, newItem.price)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'List Item'}
            </Button>
          </div>
        </Card>

        {/* Items for Sale */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Card key={index} className="transform transition-all hover:scale-105">
                <div className="aspect-square rounded-lg bg-gray-700 mb-4 overflow-hidden">
                  <img
                    src={`/api/placeholder/400/400`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">Price</span>
                  <span className="text-lg font-bold text-purple-400">
                    {ethers.utils.formatEther(item.price)} ETH
                  </span>
                </div>
                <Button 
                  gradientDuoTone="purpleToPink"
                  onClick={() => purchaseItem(item.id, ethers.utils.formatEther(item.price))}
                  disabled={loading}
                  fullSized
                >
                  Purchase
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Owned Items */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-purple-400">Your Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedItems.map((item, index) => (
              <Card key={index}>
                <div className="aspect-square rounded-lg bg-gray-700 mb-4 overflow-hidden">
                  <img
                    src={`/api/placeholder/400/400`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <TextInput
                  type="text"
                  placeholder="Transfer Address"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="mb-4"
                />
                <Button 
                  color="gray"
                  onClick={() => transferItem(item.id, transferAddress)}
                  disabled={loading}
                  fullSized
                >
                  Transfer
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;