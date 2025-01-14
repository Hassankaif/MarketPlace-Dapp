import { useState, useEffect } from "react";
import Contractjson from "../build/contracts/MarketPlace.json";
import { ethers } from "ethers";
import "./App.css";

function App() {
  const ContactAddress = "0x5F83D3E597Bb549FaFFa19A7f3364Ac9fDc97c21";
  const ContractABI = Contractjson.abi;

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccounts(accounts[0]);

        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(ContactAddress, ContractABI, signer);
        setContract(contract);

        if (contract) {
          await LoadItems(contract);
          await LoadOwnedItems(contract, accounts[0]);
        }

        window.ethereum.on("accountsChanged", async (accounts) => {
          setAccounts(accounts[0]);
          const updatedSigner = provider.getSigner();
          const updatedContract = new ethers.Contract(
            ContactAddress,
            ContractABI,
            updatedSigner
          );
          setSigner(updatedSigner);
          setContract(updatedContract);

          if (updatedContract) {
            await LoadItems(updatedContract);
            await LoadOwnedItems(updatedContract, accounts[0]);
          }
        });
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
    init();
  }, []);

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
    <div className="App">
      <header className="app-header">
        <h1>Welcome to Marketplace</h1>
      </header>
      <main>
        <section className="list-item">
          <h2>List an Item for Sale</h2>
          <input
            id="itemName"
            placeholder="Item Name"
            className="input-field"
          />
          <input
            id="itemPrice"
            placeholder="Price (in ETH)"
            className="input-field"
          />
          <button
            className="button"
            onClick={() =>
              ListItems(
                document.getElementById("itemName").value,
                document.getElementById("itemPrice").value
              )
            }
          >
            List Item
          </button>
        </section>

        <section className="items">
          <h2>Items for Sale</h2>
          <div className="grid-container">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Price:</strong> {ethers.utils.formatEther(item.price)} ETH</p>
                {!item.isSold && (
                  <button
                    className="button"
                    onClick={() =>
                      purchaseItem(item.id, ethers.utils.formatEther(item.price))
                    }
                  >
                    Buy Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="owned-items">
          <h2>Your Items</h2>
          <div className="grid-container">
            {ownedItems.map((item) => (
              <div key={item.id} className="item-card">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Price:</strong> {ethers.utils.formatEther(item.price)} ETH</p>
                <input
                  id={`transferAddress${item.id}`}
                  placeholder="Transfer To"
                  className="input-field"
                />
                <button
                  className="button"
                  onClick={() =>
                    transferItem(
                      item.id,
                      document.getElementById(`transferAddress${item.id}`)
                        .value
                    )
                  }
                >
                  Transfer
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
