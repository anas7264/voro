import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorage } from '@/hooks/useStorage';

const ShoppingList = () => {
  const { getStorage, setStorage } = useStorage();
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    document.title = 'VORO | Shopping List';
    const data = getStorage('voro_shopping_list') || [];
    setItems(data);
  }, []);

  const handleAddItem = () => {
    if (!inputValue.trim()) return;
    const updated = [...items, { id: Date.now(), text: inputValue, checked: false }];
    setItems(updated);
    setStorage('voro_shopping_list', updated);
    setInputValue('');
  };

  const handleToggleItem = (id) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updated);
    setStorage('voro_shopping_list', updated);
  };

  const handleDeleteItem = (id) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    setStorage('voro_shopping_list', updated);
  };

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="min-h-screen bg-voro-surface p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Shopping List</h1>
        <p className="text-gray-400 mb-6">{checkedCount} of {items.length} items purchased</p>

        <Card className="p-6 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Add item..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <Button onClick={handleAddItem} className="flex items-center gap-2">
              <Plus size={18} />
              Add
            </Button>
          </div>
        </Card>

        {items.length > 0 ? (
          <Card className="p-6">
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-voro-surface rounded-lg hover:bg-opacity-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleItem(item.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className={`flex-1 ${item.checked ? 'line-through text-gray-500' : 'text-white'}`}>
                    {item.text}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-danger"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-white mb-2">No items yet</h3>
            <p className="text-gray-400">Add items to your shopping list</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
