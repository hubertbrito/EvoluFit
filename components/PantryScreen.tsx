
import React from 'react';
import { Mic, Plus, Search, Trash2, Info, Check } from 'lucide-react';
import { FoodItem, PlateItem } from '../types';

interface PantryProps {
  allFoods: FoodItem[];
  userPantry: string[];
  currentPlate: PlateItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToPlate: (id: string) => void;
  onVoiceClick: () => void;
  isListening: boolean;
  onAddManual: (name: string) => void;
}

const PantryScreen: React.FC<PantryProps> = ({ allFoods, userPantry, currentPlate, onToggle, onDelete, onAddToPlate, onVoiceClick, isListening, onAddManual }) => {
  const [search, setSearch] = React.useState('');
  
  const visibleItems = search 
    ? allFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    : allFoods.filter(f => userPantry.includes(f.id));

  const handleManualAdd = () => {
    if (search.trim()) {
      onAddManual(search.trim());
      setSearch('');
    }
  };

  const handleDeleteWithConfirm = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir "${name}" da sua dispensa?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-start space-x-3">
        <Info className="text-emerald-600 shrink-0 mt-0.5" size={18} />
        <p className="text-[11px] text-emerald-800 font-medium leading-tight">
          <strong>PASSO 1:</strong> Toque em um alimento para adicioná-lo ao <strong>PRATO</strong>. Use a lixeira para remover da dispensa (será solicitada confirmação).
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Dispensa Inteligente</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Sua base de dados TACO</p>
      </div>

      <div className="flex justify-center relative">
        <button 
          onClick={onVoiceClick}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative z-10 ${isListening ? 'bg-blue-500 animate-pulse-blue' : 'bg-emerald-500 active:scale-90 shadow-emerald-200'}`}
        >
          <Mic size={40} color="white" />
        </button>
        {isListening && (
            <div className="absolute -bottom-6 text-blue-500 font-black text-[10px] animate-pulse uppercase tracking-widest">Processando voz...</div>
        )}
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Qual alimento falta?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-[2rem] shadow-sm border-none focus:ring-2 focus:ring-emerald-400 outline-none text-lg font-bold text-gray-700"
          />
        </div>
        {search && (
          <button 
            onClick={handleManualAdd}
            className="bg-emerald-500 text-white px-5 rounded-[2rem] shadow-lg hover:bg-emerald-600 transition-all active:scale-90 flex items-center"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-28">
        {visibleItems.map(food => {
          const isSelectedInPantry = userPantry.includes(food.id);
          const isOnPlate = currentPlate.some(p => p.foodId === food.id);

          return (
            <div 
              key={food.id}
              onClick={() => onAddToPlate(food.id)}
              className={`relative p-5 rounded-[2.5rem] border-2 transition-all cursor-pointer group active:scale-95 flex flex-col justify-center min-h-[100px] ${isOnPlate ? 'border-emerald-500 bg-emerald-50' : isSelectedInPantry ? 'border-gray-100 bg-white' : 'border-white bg-white shadow-sm opacity-60'}`}
            >
              <div className="font-black text-sm leading-tight text-gray-800 break-words pr-8">{food.name}</div>
              
              <div className="flex flex-col space-y-1 absolute top-2 right-2">
                 <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddToPlate(food.id);
                  }}
                  className={`${isOnPlate ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500 text-white'} rounded-full p-2 shadow-lg transition-all hover:scale-110`}
                >
                  {isOnPlate ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                </button>
                <button 
                  onClick={(e) => handleDeleteWithConfirm(e, food.id, food.name)}
                  className="bg-rose-50 text-rose-400 rounded-full p-2 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PantryScreen;
