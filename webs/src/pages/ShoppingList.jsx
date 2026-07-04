import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, ShoppingCart, Zap } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import { useNotifications } from '@/hooks/useNotifications';

const ShoppingList = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey('shopping_list') for specific data
   * and useStorageMethods for stable action references.
   * ESTIMATED IMPACT: Eliminates redundant re-renders when unrelated storage keys change.
   */
  const items = useStorageKey('shopping_list') || [];
  const { setItem } = useStorageMethods();
  const { addNotification } = useNotifications();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    document.title = 'VORO | Shopping List';
  }, []);

  const handleAddItem = useCallback(async () => {
    if (!inputValue.trim()) return;

    const newItem = { id: Date.now(), text: inputValue, checked: false };
    const updated = [...items, newItem];

    /**
     * ⚡ OPTIMISTIC UI: The useStorageKey hook will reactively update the UI
     * immediately after setItem is called.
     */
    await setItem('shopping_list', updated);
    setInputValue('');
    addNotification('Provisions added to matrix', 'success');
  }, [items, inputValue, setItem, addNotification]);

  const handleToggleItem = useCallback(async (id) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    await setItem('shopping_list', updated);
  }, [items, setItem]);

  const handleDeleteItem = useCallback(async (id) => {
    const updated = items.filter(item => item.id !== id);
    await setItem('shopping_list', updated);
    addNotification('Artifact purged from list', 'info');
  }, [items, setItem, addNotification]);

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] selection:bg-voro-primary/30 pb-24">
      {/* Ambient background architectural lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-voro-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-voro-primary mb-4">
            <ShoppingCart size={18} />
            <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[0.4em]">Provision Acquisition List</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-white tracking-tight">
            Shopping <span className="text-voro-primary not-italic font-bold">List</span>
          </h1>
          <p className="mt-4 text-gray-500 font-medium tracking-widest text-[0.65rem] uppercase opacity-60">
            {checkedCount} of {items.length} items acquired in the current cycle
          </p>
        </header>

        <Card className="p-8 mb-8 bg-[#0A0C14] border-white/5 shadow-2xl">
          <div className="flex gap-4">
            <Input
              placeholder="Integrate new provision..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              className="flex-1 bg-white/[0.02] border-white/10 italic font-serif"
            />
            <Button onClick={handleAddItem} className="px-8 shadow-lg shadow-voro-primary/20">
              <Plus size={18} className="mr-2" />
              Add
            </Button>
          </div>
        </Card>

        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map(item => (
              <Card
                key={item.id}
                className={`p-6 flex items-center gap-4 transition-all duration-500 ${
                  item.checked ? 'opacity-50 border-white/5 bg-white/[0.01]' : 'border-white/10 bg-[#0A0C14]'
                } group hover:border-voro-primary/30`}
              >
                <button
                  onClick={() => handleToggleItem(item.id)}
                  className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                    ${item.checked
                      ? 'bg-voro-primary border-voro-primary text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                      : 'border-white/10 hover:border-voro-primary/50'
                    }
                  `}
                >
                  {item.checked && <Check size={14} strokeWidth={4} />}
                </button>

                <span className={`flex-1 text-lg font-serif italic tracking-tight transition-all duration-500 ${
                  item.checked ? 'line-through text-gray-600' : 'text-white'
                }`}>
                  {item.text}
                </span>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-3 rounded-xl text-gray-800 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Purge item"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-20 text-center border-dashed border-white/5 bg-transparent">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <ShoppingCart size={32} className="text-gray-700" />
            </div>
            <h3 className="text-xl font-serif italic font-bold text-white mb-2">Inventory Void</h3>
            <p className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.2em]">Awaiting provision integration</p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Simple Check icon since it wasn't imported from lucide-react in the original
const Check = ({ size = 18, className = "", strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ShoppingList;
