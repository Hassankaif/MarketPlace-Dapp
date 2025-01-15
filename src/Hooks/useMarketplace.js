// src/hooks/useMarketplace.js
import { useState } from 'react';
import { ethers } from 'ethers';
import { uploadToIPFS } from '../utils/ipfs';

export const useMarketplace = (contract, accounts) => {
  const [items, setItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
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

  const loadOwnedItems = async () => {
    try {
      if (!contract || !accounts) return;
      const ownedItemsIDs = await contract.getItemsByOwner(accounts);
      const ownedItems = await Promise.all(
        ownedItemsIDs.map(id => contract.items(id))
      );
      setOwnedItems(ownedItems);
    } catch (error) {
      console.error("Error loading owned items:", error);
    }
  };

  const listItem = async (name, price, file) => {
    try {
      setLoading(true);
      const imageURI = await uploadToIPFS(file);
      const tx = await contract.ListItemsForSale(
        name,
        ethers.utils.parseEther(price),
        imageURI
      );
      await tx.wait();
      await loadItems();
      return true;
    } catch (error) {
      console.error("Error listing item:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (id, price) => {
    try {
      const tx = await contract.PurchaseItem(id, {
        value: ethers.utils.parseEther(price),
      });
      await tx.wait();
      await loadItems();
      await loadOwnedItems();
    } catch (error) {
      console.error("Error purchasing item:", error);
    }
  };

  const confirmDelivery = async (id) => {
    try {
      const tx = await contract.confirmDelivery(id);
      await tx.wait();
      await loadItems();
      await loadOwnedItems();
    } catch (error) {
      console.error("Error confirming delivery:", error);
    }
  };

  return {
    items,
    ownedItems,
    loading,
    listItem,
    purchaseItem,
    confirmDelivery,
    loadItems,
    loadOwnedItems
  };
};