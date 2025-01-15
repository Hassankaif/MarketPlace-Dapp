// src/components/OwnedItemsGrid.jsx
import { useState } from 'react';
import { Button, TextInput, Card, Badge } from 'flowbite-react';
import { getIPFSGatewayURL } from '../utils/ipfs';
import { ethers } from 'ethers';

export const OwnedItemsGrid = ({ items, contract, loading }) => {
  const [transferAddresses, setTransferAddresses] = useState({});

  const handleTransferAddress = (itemId, address) => {
    setTransferAddresses(prev => ({
      ...prev,
      [itemId]: address
    }));
  };

  const handleTransfer = async (itemId) => {
    try {
      if (!transferAddresses[itemId]) {
        alert('Please enter a valid transfer address');
        return;
      }
  
      // Check if the contract and method exist
      if (contract && typeof contract.transferItemForFree === 'function') {
        const tx = await contract.transferItemForFree(itemId, transferAddresses[itemId]);
        await tx.wait();
        
        // Clear the transfer address after successful transfer
        setTransferAddresses(prev => ({
          ...prev,
          [itemId]: ''
        }));
  
        alert('Item transferred successfully!');
      } else {
        alert('Contract method transferItemForFree is not available');
      }
    } catch (error) {
      console.error('Error transferring item:', error);
      alert('Error transferring item. Please check the console for details.');
    }
  };
  

  if (!items.length) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Your Collection</h2>
        <Card>
          <p className="text-center text-gray-500 py-8">
            You don't own any items yet. Purchase something from the marketplace!
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Your Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Card key={index} className="transform transition-all hover:scale-105">
            <div className="aspect-square rounded-lg bg-gray-700 mb-4 overflow-hidden">
              <img
                src={getIPFSGatewayURL(item.imageURI)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Original Price</span>
                <span className="text-lg font-bold text-purple-400">
                  {ethers.utils.formatEther(item.price)} ETH
                </span>
              </div>

              {item.isDelivered && (
                <Badge color="success" className="mb-4">
                  Delivered
                </Badge>
              )}

              <div className="space-y-4">
                <TextInput
                  type="text"
                  placeholder="Transfer Address (0x...)"
                  value={transferAddresses[item.id] || ''}
                  onChange={(e) => handleTransferAddress(item.id, e.target.value)}
                  className="w-full"
                />
                
                <Button 
                  color="gray"
                  onClick={() => handleTransfer(item.id)}
                  disabled={loading || !transferAddresses[item.id]}
                  fullSized
                >
                  {loading ? 'Processing...' : 'Transfer Item'}
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>Item ID: {item.id.toString()}</p>
                <p className="truncate">Seller: {item.seller}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};