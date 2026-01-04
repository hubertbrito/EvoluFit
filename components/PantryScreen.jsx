import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Plus, Trash2, Utensils, Info, Filter, ArrowUp } from 'lucide-react';
import { DIET_TYPES } from '../constants';

// Função auxiliar para formatar a quantidade e medida do alimento
const formatFoodQuantity = (quantity, measure, foodName) => {
  const qty = parseFloat(quantity);
  const meas = measure || 'unidade(s)';
  // Tenta calcular total se a medida começar com número (ex: "2 fatias")
  const match = meas.match(/^(\d+)\s+(.+)/);
  if (match && !isNaN(qty)) {
    const total = qty * parseInt(match[1], 10);
    return `${total} ${match[2]} de ${foodName}`;
  }
  return `${qty} ${meas} de ${foodName}`;
};

const PantryScreen = ({ 
  allFoods, 
  userPantry, 
  currentPlate, 
  onToggle, 
  onDelete, 
  onAddToPlate, 
  onVoiceClick, 
  isListening, 
  onAddManual,
  searchTerm,
  onSearchTermChange,
  voiceAddedFoodId,
  showTour,
  tourStep
}) => {
  // const [searchTerm, setSearchTerm] = useState(''); // Estado movido para App.jsx
  const [activeCategory, setActiveCategory] = useState('Dispensa');
  const [viewMode, setViewMode] = useState('categories'); // 'categories' | 'diets'
  const [activeDiet, setActiveDiet] = useState('Todas');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef(null);
  
  const categories = ['Dispensa', 'Frutas', 'Vegetais', 'Carboidratos', 'Proteínas', 'Leguminosas', 'Laticínios', 'Gorduras', 'Bebidas', 'Doces', 'Industrializados'];
  const diets = ['Todas', ...DIET_TYPES];

  // Lógica de Filtro: Busca > Categoria > Dispensa
  const displayedFoods = (() => {
    if (searchTerm) {
      const normalize = (str) => {
        return (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };
      const term = normalize(searchTerm);
      
      return allFoods
        .filter(f => normalize(f.name).includes(term))
        .sort((a, b) => {
          const nameA = normalize(a.name);
          const nameB = normalize(b.name);
          const startsA = nameA.startsWith(term);
          const startsB = nameB.startsWith(term);
          if (startsA && !startsB) return -1;
          if (!startsA && startsB) return 1;
          return a.name.localeCompare(b.name);
        });
    }
    if (viewMode === 'categories') {
        if (activeCategory === 'Dispensa') return allFoods.filter(f => userPantry.includes(f.id));
        return allFoods.filter(f => f.category === activeCategory);
    }
    return activeDiet === 'Todas' ? allFoods : allFoods.filter(f => f.diets && f.diets.includes(activeDiet));
  })();

  const resultCountText = (() => {
    const count = displayedFoods.length;
    const suffix = count === 1 ? 'item encontrado' : 'itens encontrados';
    
    if (searchTerm) return `${count} ${suffix}`;
    if (viewMode === 'categories') {
      if (activeCategory === 'Dispensa') return `${count} ${suffix} na Sua Dispensa`;
      return `${count} ${suffix} na categoria ${activeCategory}`;
    }
    return activeDiet === 'Todas' ? `${count} ${suffix} no geral` : `${count} ${suffix} para a dieta ${activeDiet}`;
  })();

  const handleManualAdd = () => {
    if (searchTerm) {
      onAddManual(searchTerm);
      onSearchTermChange(''); // Limpa o termo de busca no App.jsx
    }
  };

  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const handleScroll = () => {
      setShowScrollTop(main.scrollTop > 300);
    };
    main.addEventListener('scroll', handleScroll);
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito para rolar a tela até o item adicionado por voz
  useEffect(() => {
    if (voiceAddedFoodId && listRef.current) {
      const itemElement = listRef.current.querySelector(`[data-food-id="${voiceAddedFoodId}"]`);
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [voiceAddedFoodId]);

  return (
    <div className="p-4 space-y-4 pb-24">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes pulse-highlight {
          0% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0); }
        }
        .highlight-voice-add {
          animation: pulse-highlight 2s ease-out 5; /* 2s x 5 = 10s de destaque */
        }
      `}</style>
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700"><strong>Dispensa:</strong> Busque ou use a voz para <strong>adicionar novos itens</strong> que você tem em casa. Depois, toque em um alimento para <strong>selecioná-lo</strong> (borda verde) e montar seu Prato.</p>
      </div>

      {/* Sticky Menu Container */}
      <div className="sticky top-0 z-20 bg-gray-50 -mx-4 px-4 py-2 space-y-3 shadow-sm">
        {/* Header / Search */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 block ml-1">
            Busque um alimento ou digite para cadastrar um novo:
          </label>
          <div className="flex gap-2" data-tour-id="pantry-search">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Digite o nome do alimento..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-0 placeholder:text-emerald-600/60 text-emerald-900 font-medium"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
              />
            </div>
            <button 
              onClick={onVoiceClick}
              className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-rose-500 text-[11px] font-semibold px-2 pt-1">
            Dica: Em modo offline, o microfone pode falhar. Prefira digitar.
          </p>
        </div>

        {/* Toggle View Mode */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
              onClick={() => setViewMode('categories')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'categories' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
          >
              Por Categorias
          </button>
          <button 
              onClick={() => setViewMode('diets')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${viewMode === 'diets' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
          >
              <Filter className="w-3 h-3" />
              Por Dietas
          </button>
        </div>

        {/* Menu Horizontal (Categorias ou Dietas) */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(viewMode === 'categories' ? categories : diets).map(item => {
            const isDispensa = item === 'Dispensa' && viewMode === 'categories';
            const isActive = (viewMode === 'categories' ? activeCategory : activeDiet) === item;
            return (
              <button
                key={item}
                onClick={() => {
                  if (viewMode === 'categories') setActiveCategory(item);
                  else setActiveDiet(item);
                  onSearchTermChange(''); // Limpa a busca ao trocar de categoria
                  scrollToTop();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors 
                    ${isActive 
                      ? (isDispensa ? 'bg-blue-600 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md') 
                      : (isDispensa ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white text-gray-500 border border-gray-200')}`}
              >
                {isDispensa ? 'Sua Dispensa' : item}
              </button>
            );
          })}
        </div>
      </div>

      <div key={resultCountText} className="text-sm font-bold text-emerald-700 ml-1 animate-fade-in">
        {resultCountText}
      </div>

      {/* Add Manual Button if search doesn't match */}
      {searchTerm && displayedFoods.length === 0 && (
        <button 
          onClick={handleManualAdd} // A função interna agora usa as props
          className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl border border-dashed border-emerald-200 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar "{searchTerm}"
        </button>
      )}

      {/* List */}
      <div ref={listRef} key={`${viewMode}-${viewMode === 'categories' ? activeCategory : activeDiet}`} className="space-y-3 animate-fade-in">
        {displayedFoods.map(food => {
          const isInPantry = userPantry.includes(food.id);
          const plateItem = currentPlate.find(p => p.foodId === food.id);
          const isSelected = !!plateItem;
          const isVoiceAdded = food.id === voiceAddedFoodId;

          const itemClasses = [
            'p-4 rounded-2xl shadow-sm border flex items-center justify-between cursor-pointer transition-all',
            isSelected ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-gray-100',
            isVoiceAdded ? 'highlight-voice-add' : ''
          ].filter(Boolean).join(' ');

          return (
            <div 
              key={food.id} 
              data-food-id={food.id}
              onClick={() => isInPantry ? onAddToPlate(food.id) : onToggle(food.id)}
              className={itemClasses}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{food.emoji || '🍽️'}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{food.name}</h3>
                  {isSelected && plateItem.quantity && (
                    <p className="text-xs text-emerald-700 font-medium mt-0.5">
                      {formatFoodQuantity(plateItem.quantity, plateItem.measure, food.name)}
                    </p>
                  )}
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

        {displayedFoods.length === 0 && !searchTerm && viewMode === 'categories' && activeCategory === 'Dispensa' && (
          <div className="text-center py-10 text-gray-400">
            <p>Sua dispensa está vazia.</p>
            <p className="text-sm">Navegue pelas categorias acima para adicionar alimentos.</p>
          </div>
        )}

        {displayedFoods.length === 0 && !searchTerm && (viewMode === 'diets' || activeCategory !== 'Dispensa') && (
          <div className="text-center py-10 text-gray-400">
            <p>Nenhum item encontrado nesta categoria.</p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all z-30 animate-bounce"
          title="Voltar ao Topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default PantryScreen;