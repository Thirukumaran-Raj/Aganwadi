import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Item Form State
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Food');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/inventory');
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle adding a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', {
        itemName,
        category,
        quantity: Number(quantity),
        unit
      });
      // Clear form and refresh table
      setItemName(''); setQuantity(''); setUnit('');
      fetchInventory();
    } catch (error) {
      alert('Failed to add inventory item');
    }
  };

  // Handle updating stock (Quick + and - buttons)
  const handleUpdateStock = async (id, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 0) return; // Prevent negative stock

    try {
      await api.put(`/inventory/${id}`, { quantity: newQty });
      fetchInventory(); // Refresh table to show new amount
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading inventory...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-bold mb-4 hover:underline">
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add New Item Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Supply</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Item Name</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required placeholder="e.g., Rice, Paracetamol" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Food">Food</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Supplies">Supplies</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700">Quantity</label>
                  <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700">Unit</label>
                  <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required placeholder="kg, liters, boxes" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">Add Item</button>
            </form>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50"><h3 className="font-bold text-gray-800">Current Stock</h3></div>
            <div className="p-4 overflow-x-auto">
              {inventory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No inventory items added yet.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="pb-2">Item Name</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2 text-center">In Stock</th>
                      <th className="pb-2 text-center">Update Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-800">{item.itemName}</td>
                        <td className="py-3 text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            item.category === 'Food' ? 'bg-green-100 text-green-700' : 
                            item.category === 'Medicine' ? 'bg-red-100 text-red-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 text-center font-bold text-lg text-blue-600">
                          {item.quantity} <span className="text-xs text-gray-500 font-normal">{item.unit}</span>
                        </td>
                        <td className="py-3 flex justify-center gap-2">
                          <button onClick={() => handleUpdateStock(item._id, item.quantity, -1)} className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded font-bold transition">-</button>
                          <button onClick={() => handleUpdateStock(item._id, item.quantity, 1)} className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded font-bold transition">+</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Inventory;