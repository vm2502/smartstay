import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function FoodMenu() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [menuItems, setMenuItems] = useState([]);
  
  const [newItemName, setNewItemName] = useState({ breakfast: '', lunch: '', dinner: '' });

  const fetchMenu = async () => {
    try {
      const res = await axios.get('/food');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu', err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddItem = async (meal_type) => {
    if (!newItemName[meal_type]) return;
    try {
      await axios.post('/food', { meal_type, item_name: newItemName[meal_type] });
      setNewItemName({ ...newItemName, [meal_type]: '' });
      fetchMenu();
    } catch (err) {
      console.error('Error adding item', err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/food/${id}`);
      fetchMenu();
    } catch (err) {
      console.error('Error deleting item', err);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const getItemsForMeal = (meal_type) => menuItems.filter(item => item.meal_type === meal_type);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col space-y-6 fade-in">
      <header className="flex flex-col gap-2 pb-4 border-b border-slate-200/60">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 group flex items-center">
          Today's Food Menu
          <span className="text-blue-600 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">🍽️</span>
        </h1>
        <p className="text-sm uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          {today}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <MenuCard 
          title="Breakfast" icon="🍳" type="breakfast" delay="0" 
          items={getItemsForMeal('breakfast')} 
          isAdmin={isAdmin} onDelete={handleDeleteItem} onAdd={handleAddItem}
          inputValue={newItemName.breakfast}
          onInputChange={(val) => setNewItemName({...newItemName, breakfast: val})}
        />
        <MenuCard 
          title="Lunch" icon="🍛" type="lunch" delay="100" 
          items={getItemsForMeal('lunch')}
          isAdmin={isAdmin} onDelete={handleDeleteItem} onAdd={handleAddItem}
          inputValue={newItemName.lunch}
          onInputChange={(val) => setNewItemName({...newItemName, lunch: val})}
        />
        <MenuCard 
          title="Dinner" icon="🍽️" type="dinner" delay="200" 
          items={getItemsForMeal('dinner')}
          isAdmin={isAdmin} onDelete={handleDeleteItem} onAdd={handleAddItem}
          inputValue={newItemName.dinner}
          onInputChange={(val) => setNewItemName({...newItemName, dinner: val})}
        />
      </div>
    </div>
  );
}

function MenuCard({ title, icon, type, items, delay, isAdmin, onDelete, onAdd, inputValue, onInputChange }) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">{title}</h2>
      </div>
      <ul className="space-y-4 flex-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-slate-600 font-semibold text-md group/item">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-blue-500/50 flex-shrink-0 group-hover/item:bg-blue-600 transition-colors group-hover/item:scale-125 duration-300"></span>
              <span className="group-hover/item:text-slate-900 transition-colors duration-200">{item.item_name}</span>
            </div>
            {isAdmin && (
              <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-600 opacity-50 hover:opacity-100 transition-opacity p-1">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      {isAdmin && (
        <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
          <input 
            type="text" 
            placeholder="Add new item..." 
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAdd(type)}
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
          <button onClick={() => onAdd(type)} className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition flex items-center justify-center shadow">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      )}
    </div>
  );
}
