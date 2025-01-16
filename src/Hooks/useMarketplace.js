// src/hooks/useMarketplace.js
import { useState } from 'react';
import { ethers } from 'ethers';
import { uploadToIPFS } from '../utils/ipfs';
import { useTransaction } from './useTransaction';

export const useMarketplace = (contract, accounts) => {
  const [items, setItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    isProcessing,
    txStatus,
    txMessage,
    handleTransaction,
    clearTxStatus
  } = useTransaction();

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
    return handleTransaction(
      async () => {
        const imageURI = await uploadToIPFS(file);
        const tx = await contract.ListItemsForSale(
          name,
          ethers.utils.parseEther(price),
          imageURI
        );
        return tx;
      },
      'Item listed successfully!'
    );
  };

  const purchaseItem = async (id, price) => {
    return handleTransaction(
      async () => {
        const tx = await contract.PurchaseItem(id, {
          value: ethers.utils.parseEther(price),
        });
        return tx;
      },
      'Item purchased successfully!'
    );
  };

  const confirmDelivery = async (id) => {
    return handleTransaction(
      async () => {
        const tx = await contract.confirmDelivery(id);
        return tx;
      },
      'Delivery confirmed successfully!'
    );
  };

  return {
    items,
    ownedItems,
    loading,
    listItem,
    purchaseItem,
    confirmDelivery,
    loadItems,
    loadOwnedItems,
    isProcessing,
    txStatus,
    txMessage,
    clearTxStatus
  };
};