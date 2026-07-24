import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ShoppingCart, Zap, CheckCircle2, Package } from 'lucide-react';
import { useStorageKey, useStorageMethods } from '@/hooks/useStorage';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';

const ShoppingList = () => {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Surgical Reactivity.
   * Replaced broad useStorage() with useStorageKey for specific data and
   * useStorageMethods for stable, non-reactive action references.
   * This component now only re-renders when the 'shopping_list' key changes.
   */
  const shoppingListData = useStorageKey('shopping_list');
  const shoppingList = useMemo(() => Array.isArray(shoppingListData) ? shoppingListData : [], [shoppingListData]);
  const { setItem } = useStorageMethods();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    document.title = 'VORO | Shopping Manifest';
  }, []);

  const handleAddItem = async () => {
    if (!inputValue.trim()) return;
    const updated = [...shoppingList, { id: Date.now(), text: inputValue, checked: false }];
    await setItem('shopping_list', updated);
    setInputValue('');
  };

  const handleToggleItem = async (id) => {
    const updated = shoppingList.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    await setItem('shopping_list', updated);
  };

  const handleDeleteItem = async (id) => {
    const updated = shoppingList.filter(item => item.id !== id);
    await setItem('shopping_list', updated);
  };

  const checkedCount = shoppingList.filter(i => i.checked).length;

  return (
    <div className="min-h-screen bg-[#020408] text-[#F0F4FF] pb-32 selection:bg-voro-primary/30">
      {/* Ambient Depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-voro-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-voro-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="mb-20 space-y-6">
          <div className="flex items-center gap-3 text-voro-primary">
            <ShoppingCart size={18} />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.4em]">Resource Procurement</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic font-medium text-white tracking-tight leading-tight">
            Shopping <span className="text-gradient not-italic font-bold">Manifest</span>
          </h1>
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
                <span className="text-[0.55rem] font-black text-gray-500 uppercase tracking-[0.3em]">
                  {checkedCount} / {shoppingList.length} Units Secured
                </span>
             </div>
             {shoppingList.length > 0 && checkedCount === shoppingList.length && (
               <div className="flex items-center gap-2 text-voro-secondary animate-fade-in">
                  <CheckCircle2 size={14} />
                  <span className="text-[0.55rem] font-black uppercase tracking-widest">Supply Chain Optimized</span>
               </div>
             )}
          </div>
        </header>

        <Card className="p-10 mb-12 bg-[#0A0C14]/60 backdrop-blur-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-voro-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

          <div className="relative flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter resource signature..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                className="bg-[#020408]/40 border-white/10 h-16 px-6 text-lg font-serif italic"
              />
            </div>
            <Button
              onClick={handleAddItem}
              className="h-16 px-10 text-[0.7rem] font-black uppercase tracking-[0.3em] shadow-xl shadow-voro-primary/20"
            >
              <Plus size={18} className="mr-2" />
              Append Manifest
            </Button>
          </div>
        </Card>

        {shoppingList.length > 0 ? (
          <div className="space-y-4">
            {shoppingList.map((item, idx) => (
              <div
                key={item.id}
                className="group relative flex items-center gap-6 p-6 bg-[#0A0C14]/40 border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <button
                  role="checkbox"
                  aria-checked={item.checked}
                  aria-label={`Toggle secure status for ${item.text}`}
                  onClick={() => handleToggleItem(item.id)}
                  className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-voro-primary ${
                    item.checked
                      ? 'bg-voro-primary border-voro-primary shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {item.checked && <Plus size={14} className="text-white rotate-45" />}
                </button>

                <span className={`flex-1 text-xl font-serif italic transition-all duration-700 ${
                  item.checked ? 'text-gray-600 line-through' : 'text-gray-200'
                }`}>
                  {item.text}
                </span>

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                   <span className="text-[0.5rem] font-mono text-gray-700 uppercase tracking-widest hidden md:block">
                     [0x{item.id.toString(16).toUpperCase().slice(-4)}]
                   </span>
                   <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-3 rounded-xl text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label={`Purge ${item.text}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 relative group">
               <div className="absolute inset-0 bg-voro-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <Package size={32} className="text-gray-800 group-hover:text-voro-primary/50 transition-colors duration-700" />
            </div>
            <h3 className="text-[0.65rem] font-black text-gray-600 uppercase tracking-[0.5em] mb-2">Manifest Vacuum</h3>
            <p className="text-[0.55rem] font-mono text-gray-700 uppercase tracking-widest">Awaiting procurement logistics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
