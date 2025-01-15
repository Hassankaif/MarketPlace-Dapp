import { getIPFSGatewayURL } from "../utils/ipfs";
import { Card, Button, Badge } from "flowbite-react";
import { ethers } from "ethers";
// src/components/ItemCard.jsx
export const ItemCard = ({ item, onPurchase, onConfirmDelivery, currentAddress, loading }) => (
    <Card className="transform transition-all hover:scale-105">
      <div className="aspect-square rounded-lg bg-gray-700 mb-4 overflow-hidden">
        <img
          src={getIPFSGatewayURL(item.imageURI)}
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
      <div className="flex flex-col gap-2">
        <Button 
          gradientDuoTone="purpleToPink"
          onClick={() => onPurchase(item.id, ethers.utils.formatEther(item.price))}
          disabled={loading || item.isSold}
          fullSized
        >
          {item.isSold ? 'Sold' : 'Purchase'}
        </Button>
        {item.isSold && item.owner === currentAddress && !item.isDelivered && (
          <Button
            color="green"
            onClick={() => onConfirmDelivery(item.id)}
            fullSized
          >
            Confirm Delivery
          </Button>
        )}
      </div>
      {item.isDelivered && (
        <Badge color="success" className="mt-2">
          Delivered
        </Badge>
      )}
    </Card>
  );