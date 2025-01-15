// src/components/ListItemForm.jsx
import { useState } from "react";
import { Card, TextInput, Button } from "flowbite-react";

export const ListItemForm = ({ onSubmit, loading }) => {
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      try {
        console.log('Submitting new item', newItem, selectedFile);
        const result = await onSubmit(newItem.name, newItem.price, selectedFile);
        if (result) {
          setNewItem({ name: "", price: "" });
          setSelectedFile(null);
        } else {
          setError("Failed to list item.");
        }
      } catch (error) {
        setError(error.message);
        console.error('Form submission error:', error);
      }
    };
    
  
    return (
      <Card className="mb-12">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">List New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextInput
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
            <TextInput
              type="number"
              placeholder="Price in ETH"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              required
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
          </div>
          <Button 
            type="submit"
            gradientDuoTone="purpleToPink"
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'List Item'}
          </Button>
        </form>
      </Card>
    );
  };
  

  
