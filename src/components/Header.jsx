import { Button, Badge } from "flowbite-react";

// src/components/Header.jsx
export const Header = ({ accounts, onConnect }) => (
  <div className="py-8 px-4 bg-gray-800/50 border-b border-gray-700">
    <div className="container mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-extrabold text-purple-800">
          Decentralized Marketplace
        </h1>
        <Badge color="purple" size="lg" className="px-4 py-2">
          <Button onClick={onConnect}>
            {accounts ? `Connected: ${accounts.substring(0, 6)}...${accounts.slice(-4)}` : "Connect Wallet"}
          </Button>
        </Badge>
      </div>
    </div>
  </div>
);