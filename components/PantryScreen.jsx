import React, { useState } from 'react';
import { Search, Mic, Plus, Trash2, Utensils, Info } from 'lucide-react';

const PantryScreen = ({ 
  allFoods, 
  userPantry, 
  currentPlate, 
  onToggle, 
  onDelete, 
  onAddToPlate, 
  onVoiceClick, 
  isListening, 
  onAddManual 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Se tiver busca, procura em todos os alimentos. Se não, mostra só a dispensa.
  const displayedFoods = searchTerm 
    ? allFoods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allFoods.filter(f => userPantry.includes(f.id));

  const handleManualAdd = () => {
    if (searchTerm) {
      onAddManual(searchTerm);
      setSearchTerm('');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700"><strong>Dispensa:</strong> Busque ou use a voz para <strong>adicionar novos itens</strong> que você tem em casa. Depois, toque em um alimento para <strong>selecioná-lo</strong> (borda verde) e montar seu Prato.</p>
      </div>

      {/* Header / Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="O que você tem em casa?" 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={onVoiceClick}
          className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'}`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Add Manual Button if search doesn't match */}
      {searchTerm && displayedFoods.length === 0 && (
        <button 
          onClick={handleManualAdd}
          className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl border border-dashed border-emerald-200 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar "{searchTerm}"
        </button>
      )}

      {/* List */}
      <div className="space-y-3">
        {displayedFoods.map(food => {
          const isInPantry = userPantry.includes(food.id);
          const isSelected = currentPlate.some(p => p.foodId === food.id);
          return (
            <div 
              key={food.id} 
              onClick={() => isInPantry ? onAddToPlate(food.id) : onToggle(food.id)}
              className={`p-4 rounded-2xl shadow-sm border flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-gray-100'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{food.emoji || '🍽️'}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{food.name}</h3>
                  <p className="text-xs text-gray-400">{food.calories} kcal • {food.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isInPantry ? (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToPlate(food.id); }}
                      className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                      title={isSelected ? "Remover do Prato" : "Adicionar ao Prato"}
                    >
                      <Utensils className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(food.id); }}
                      className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                      title="Remover da Dispensa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggle(food.id); }}
                    className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    title="Adicionar à Dispensa"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {displayedFoods.length === 0 && !searchTerm && (
          <div className="text-center py-10 text-gray-400">
            <p>Sua dispensa está vazia.</p>
            <p className="text-sm">Adicione alimentos para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PantryScreen;