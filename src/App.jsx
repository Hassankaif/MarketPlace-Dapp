// src/App.jsx
import { useWeb3 } from './hooks/useWeb3';
import { useMarketplace } from './hooks/useMarketplace';
import { Header } from './components/Header';
import { ListItemForm } from './components/ListItemForm';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { useEffect } from 'react';
import { OwnedItemsGrid } from './components/OwnedItemsGrid';
import { testPinataConnection } from './utils/ipfs';

const App = () => {
  const { accounts, contract, connectWallet } = useWeb3();
  const {
    items,
    ownedItems,
    loading,
    listItem,
    purchaseItem,
    confirmDelivery,
    loadItems,
    loadOwnedItems
  } = useMarketplace(contract, accounts);

// At the top of your App component
useEffect(() => {
  console.log('Environment Variables Check:', {
    PINATA_API_KEY: !!import.meta.env.VITE_PINATA_API_KEY,
    PINATA_SECRET_KEY: !!import.meta.env.VITE_PINATA_SECRET_KEY
  });
}, []);
useEffect(() => {
  testPinataConnection();
}, []);



  useEffect(() => {
    if (contract && accounts) {
      loadItems();
      loadOwnedItems();
    }
  }, [contract, accounts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header accounts={accounts} onConnect={connectWallet} />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <ListItemForm onSubmit={listItem} loading={loading} />
        <MarketplaceGrid
          items={items}
          onPurchase={purchaseItem}
          onConfirmDelivery={confirmDelivery}
          currentAddress={accounts}
          loading={loading}
        />
        <OwnedItemsGrid items={ownedItems} contract={contract} loading={loading} />
      </main>
    </div>
  );
};

export default App;