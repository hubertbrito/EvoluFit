import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, Plus, Trash2, Utensils, Info, Filter, ArrowUp, Loader, MessageCircle, X } from 'lucide-react';
import { DIET_TYPES } from '../constants';
import { searchFoodsDB, getFoodsByCategoryDB } from '../db.js';

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
  lastSelectedFood,
  onToggle, 
  onRemoveFromPantry,
  onDeleteCustom,
  onPreview,
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
  const [displayedFoods, setDisplayedFoods] = useState([]);
  const [showInfo, setShowInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // const [searchTerm, setSearchTerm] = useState(''); // Estado movido para App.jsx
  const [activeCategory, setActiveCategory] = useState('Dispensa');
  const [viewMode, setViewMode] = useState('categories'); // 'categories' | 'diets'
  const [activeDiet, setActiveDiet] = useState('Todas');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef(null);
  
  const categories = ['Dispensa', 'Meus Alimentos', 'Frutas', 'Vegetais', 'Carboidratos', 'Proteínas', 'Leguminosas', 'Laticínios', 'Gorduras', 'Bebidas', 'Doces', 'Industrializados'];
  const diets = ['Todas', ...DIET_TYPES];

  const categoryColors = {
    'Carboidratos': 'text-orange-600 bg-orange-50 border-orange-100',
    'Proteínas': 'text-rose-600 bg-rose-50 border-rose-100',
    'Vegetais': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'Frutas': 'text-yellow-600 bg-yellow-50 border-yellow-100',
    'Leguminosas': 'text-amber-700 bg-amber-50 border-amber-100',
    'Laticínios': 'text-blue-600 bg-blue-50 border-blue-100',
    'Gorduras': 'text-amber-600 bg-amber-50 border-amber-100',
    'Bebidas': 'text-cyan-600 bg-cyan-50 border-cyan-100',
    'Doces': 'text-pink-600 bg-pink-50 border-pink-100',
    'Industrializados': 'text-gray-600 bg-gray-50 border-gray-100',
    'Outros': 'text-slate-600 bg-slate-50 border-slate-100',
    'Meus Alimentos': 'text-purple-600 bg-purple-50 border-purple-100'
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowInfo(false), 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchAndSetFoods = async () => {
      setIsLoading(true);
      if (searchTerm) {
        const dbResults = await searchFoodsDB(searchTerm);
        
        // Busca também nos alimentos customizados (que não estão no IndexedDB)
        const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const customResults = allFoods.filter(f => 
            f.id.toString().startsWith('custom-') && 
            f.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedSearch)
        );

        const results = [...dbResults, ...customResults];
        // Remove duplicatas por ID para segurança
        const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values());
        
        uniqueResults.sort((a, b) => a.name.localeCompare(b.name));
        setDisplayedFoods(uniqueResults);
      } else {
        let foods;
        // A busca por categoria agora também é otimizada com IndexedDB
        if (viewMode === 'categories') {
          if (activeCategory === 'Dispensa') {
            foods = allFoods.filter(f => userPantry.includes(f.id));
            // Ordena por categoria e depois por nome para agrupamento
            foods.sort((a, b) => {
                const catA = a.category || 'Outros';
                const catB = b.category || 'Outros';
                if (catA !== catB) return catA.localeCompare(catB);
                return a.name.localeCompare(b.name);
            });
          } else if (activeCategory === 'Meus Alimentos') {
            // Mostra TODOS os alimentos criados pelo usuário, independente da categoria nutricional
            foods = allFoods.filter(f => f.id.toString().startsWith('custom-'));
          } else {
            // Busca no DB e mescla com customizados da mesma categoria
            const dbFoods = await getFoodsByCategoryDB(activeCategory);
            const customFoods = allFoods.filter(f => f.id.toString().startsWith('custom-') && f.category === activeCategory);
            foods = [...dbFoods, ...customFoods];
          }
        } else { // A filtragem por dieta continua em memória por ser mais complexa
          foods = activeDiet === 'Todas' 
            ? allFoods 
            : allFoods.filter(f => f.diets && f.diets.includes(activeDiet));
        }
        setDisplayedFoods(foods);
      }
      setIsLoading(false);
    };

    if (allFoods.length > 0) {
      fetchAndSetFoods();
    }
  }, [searchTerm, activeCategory, viewMode, activeDiet, allFoods, userPantry]);

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
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showInfo ? 'max-h-60 opacity-100' : 'max-h-6 opacity-100 -my-2'}`}>
        {showInfo ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-2 relative">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 pr-6"><strong>Dispensa:</strong> Toque em um card para adicioná-lo à sua dispensa e selecioná-lo para o prato automaticamente. Use a lixeira para remover itens da sua lista pessoal.</p>
            <button onClick={() => setShowInfo(false)} className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 p-1"><X size={16} /></button>
          </div>
        ) : (
          <div className="flex justify-end">
              <button onClick={() => setShowInfo(true)} className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors p-0">
                  <Info size={16} />
                  <span className="text-[10px] font-bold">Info</span>
              </button>
          </div>
        )}
      </div>

      {/* Sticky Menu Container */}
      <div className="sticky top-[110px] z-20 bg-gray-50 dark:bg-gray-900 -mx-4 px-4 py-2 space-y-3 shadow-sm mt-4">
        {/* Header / Search */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block ml-1">
            Busque um alimento ou digite para cadastrar um novo:
          </label>
          <div className="flex gap-2" data-tour-id="pantry-search">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Digite o nome do alimento..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 dark:border-gray-700 bg-emerald-50/50 dark:bg-gray-800 shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-0 placeholder:text-emerald-600/60 dark:placeholder:text-gray-500 text-emerald-900 dark:text-gray-100 font-medium"
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
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button 
              onClick={() => setViewMode('categories')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'categories' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-400 dark:text-gray-500'}`}
          >
              Por Categorias
          </button>
          <button 
              onClick={() => setViewMode('diets')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${viewMode === 'diets' ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-400 dark:text-gray-500'}`}
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
                      : (isDispensa ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700')}`}
              >
                {isDispensa ? 'Sua Dispensa' : item}
              </button>
            );
          })}
        </div>
      </div>

      <div key={resultCountText} className="text-sm font-bold text-emerald-700 dark:text-emerald-400 ml-1 animate-fade-in">
        {resultCountText}
      </div>

      {/* Add Manual Button if search doesn't match */}
      {searchTerm && displayedFoods.length === 0 && (
        <button
          onClick={handleManualAdd}
          className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar "{searchTerm}"
        </button>
      )}

      {isLoading && searchTerm && (
        <div className="flex justify-center items-center py-10 text-emerald-600">
          <Loader className="w-6 h-6 animate-spin mr-3" />
          <span className="font-bold">Buscando...</span>
        </div>
      )}

      {/* List */}
      <div ref={listRef} key={`${viewMode}-${viewMode === 'categories' ? activeCategory : activeDiet}`} className="space-y-3 animate-fade-in">
        {displayedFoods.map((food, index) => {
          const isInPantry = userPantry.includes(food.id);
          const plateItem = currentPlate.find(p => p.foodId === food.id);
          const isSelected = !!plateItem;
          const isVoiceAdded = food.id === voiceAddedFoodId;
          const isPreviewed = lastSelectedFood && lastSelectedFood.id === food.id;
          const isConfirmingDelete = confirmDeleteId === food.id;

          // Lógica de Cabeçalho de Categoria (Apenas na aba Dispensa e sem busca)
          const showHeader = activeCategory === 'Dispensa' && !searchTerm && viewMode === 'categories' && (index === 0 || displayedFoods[index - 1].category !== food.category);
          const categoryStyle = categoryColors[food.category] || categoryColors['Outros'];

          const itemClasses = [
            'p-4 rounded-2xl shadow-sm border flex items-center justify-between cursor-pointer transition-all',
            isSelected ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700',
            isVoiceAdded ? 'highlight-voice-add' : ''
          ].filter(Boolean).join(' ');

          return (
            <React.Fragment key={food.id}>
            {showHeader && (
                <div className={`sticky top-32 z-10 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm mb-2 mt-4 first:mt-0 ${categoryStyle}`}>
                    {food.category || 'Outros'}
                </div>
            )}
            <div 
              data-food-id={food.id}
              onClick={() => onPreview(food)}
              onDoubleClick={() => {
                if (isInPantry) {
                    onAddToPlate(food.id);
                } else {
                    onToggle(food.id); // Adiciona à dispensa
                    onAddToPlate(food.id); // Seleciona para o prato
                }
              }}
              className={`${itemClasses} relative overflow-hidden`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl shrink-0">{food.emoji || '🍽️'}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate pr-2">{food.name}</h3>
                  {isPreviewed && (
                    <div className="flex items-center gap-2 mt-0.5 animate-fade-in">
                        <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400">Kcal {Math.round(food.calories)}</span>
                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400">Prot {Math.round(food.protein)}</span>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">Carb {Math.round(food.carbs)}</span>
                        <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-400">Lip {Math.round(food.fat)}</span>
                    </div>
                  )}
                  {isSelected && plateItem.quantity && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5 truncate">
                      {formatFoodQuantity(plateItem.quantity, plateItem.measure, food.name)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {isInPantry ? (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToPlate(food.id); }}
                      className={`p-2 rounded-lg transition-all duration-300 ${isSelected ? 'bg-emerald-500 text-white shadow-md scale-105' : (isPreviewed ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] scale-110' : 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900')}`}
                      title={isSelected ? "Remover do Prato" : "Adicionar ao Prato"}
                    >
                      <Utensils className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggle(food.id); }}
                    className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    title="Adicionar à Dispensa"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}

                {/* Botão de Lixeira Condicional */}
                {activeCategory === 'Dispensa' && isInPantry && (
                    <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setConfirmDeleteId(food.id); 
                    }}
                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                    title="Remover da Dispensa"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                )}
                {activeCategory === 'Meus Alimentos' && (
                    <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteCustom(food.id); }}
                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                    title="Excluir Alimento Permanentemente"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                )}
              </div>

              {/* Modal Discreto de Confirmação de Exclusão */}
              {isConfirmingDelete && (
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center bg-gray-50 dark:bg-gray-800/95 backdrop-blur-sm pl-4 pr-2 gap-3 z-20 animate-fade-in shadow-[-10px_0_20px_rgba(0,0,0,0.05)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">Excluir {food.name}?</span>
                      <div className="flex gap-1">
                          <button 
                              onClick={(e) => { 
                                  e.stopPropagation(); 
                                  onRemoveFromPantry(food.id); 
                                  setConfirmDeleteId(null); 
                              }}
                              className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-rose-600 active:scale-95 transition-all"
                          >
                              Sim
                          </button>
                          <button 
                              onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setConfirmDeleteId(null); 
                              }}
                              className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-600 active:scale-95 transition-all"
                          >
                              Não
                          </button>
                      </div>
                  </div>
              )}
            </div>
            </React.Fragment>
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

      {/* Suggestion Box */}
      <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center">
        <p className="text-xs text-emerald-800 dark:text-emerald-300 mb-3 font-medium">
          Não encontrou algum alimento? Ajude a melhorar o banco de dados!
        </p>
        <a 
          href="https://wa.me/5531984775695?text=Ol%C3%A1!%20Gostaria%20de%20sugerir%20um%20novo%20alimento%20para%20o%20EvoluFit:"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#128C7E] transition-transform active:scale-95"
        >
          <MessageCircle size={16} />
          Sugerir via WhatsApp
        </a>
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