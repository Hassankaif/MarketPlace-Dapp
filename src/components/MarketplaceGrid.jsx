import { ItemCard } from "./ItemCard";
  // src/components/MarketplaceGrid.jsx
  export const MarketplaceGrid = ({ items, onPurchase, onConfirmDelivery, currentAddress, loading }) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <ItemCard
            key={index}
            item={item}
            onPurchase={onPurchase}
            onConfirmDelivery={onConfirmDelivery}
            currentAddress={currentAddress}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );