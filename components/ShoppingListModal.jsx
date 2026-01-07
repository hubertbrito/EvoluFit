import React, { useState, useMemo } from 'react';
import { X, ShoppingCart, Share2, CheckSquare, Square, Copy, Filter, Check, Trash2, Layers, ChevronDown, Undo2 } from 'lucide-react';
import { getFoodUnitWeight } from '../constants';

const ShoppingListModal = ({ meals, allFoods, onClose, checkedItems, onToggleCheck, hiddenItems = {}, onToggleHidden }) => {
  const [period, setPeriod] = useState('Semana'); // 'Semana', 'Hoje', 'Amanhã', 'Personalizado'
  const [selectedGroupKeys, setSelectedGroupKeys] = useState(new Set());
  const [groupByCategory, setGroupByCategory] = useState(true);

  const toggleCheck = (id) => {
    onToggleCheck(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClearChecked = () => {
    // Adiciona os itens marcados à lista de ocultos
    const newHidden = { ...hiddenItems };
    Object.keys(checkedItems).forEach(key => {
        if (checkedItems[key]) newHidden[key] = true;
    });
    onToggleHidden(newHidden);
    
    // Limpa a seleção
    onToggleCheck({});
  };

  const handleRestoreHidden = () => {
    onToggleHidden({});
  };

  // Agrupa as refeições para seleção (Lógica similar ao Resumo)
  const mealGroups = useMemo(() => {
    const groups = {};
    meals.forEach(meal => {
        if (!meal.plate || meal.plate.length === 0) return;
        // Chave única para agrupar: ID do grupo ou ID da refeição (se avulsa/data específica)
        const key = meal.specificDate ? meal.id : (meal.groupId || meal.id);
        
        if (!groups[key]) {
            groups[key] = {
                key,
                name: meal.name,
                time: meal.time,
                days: [],
                isTemplate: meal.dayOfWeek === 'Todos'
            };
        }
        groups[key].days.push(meal.dayOfWeek);
    });
    
    return Object.values(groups).sort((a, b) => a.time.localeCompare(b.time));
  }, [meals]);

  const toggleGroup = (key) => {
    const newSet = new Set(selectedGroupKeys);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setSelectedGroupKeys(newSet);
  };

  const selectAllGroups = () => {
    if (selectedGroupKeys.size === mealGroups.length) {
        setSelectedGroupKeys(new Set());
    } else {
        setSelectedGroupKeys(new Set(mealGroups.map(g => g.key)));
    }
  };

  // Lógica principal de agrupamento
  const shoppingList = useMemo(() => {
    const list = {};
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const todayIndex = new Date().getDay();
    const today = daysMap[todayIndex];
    const tomorrow = daysMap[(todayIndex + 1) % 7];
    const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    // Filtra as refeições baseadas no período selecionado
    const relevantMeals = meals.filter(meal => {
      if (period === 'Semana') return true; // Considera tudo (incluindo 'Todos')
      
      const isTemplate = meal.dayOfWeek === 'Todos';
      const isToday = meal.dayOfWeek === today;
      const isTomorrow = meal.dayOfWeek === tomorrow;

      if (period === 'Hoje') return isToday || isTemplate;
      if (period === 'Amanhã') return isTomorrow || isTemplate;
      
      if (period === 'Personalizado') {
        const key = meal.specificDate ? meal.id : (meal.groupId || meal.id);
        return selectedGroupKeys.has(key);
      }

      if (weekDays.includes(period)) {
        return meal.dayOfWeek === period || isTemplate;
      }

      return false;
    }, [period, selectedGroupKeys]); // Dependência extra para atualizar quando a seleção mudar

    // Itera sobre as refeições e soma os ingredientes
    relevantMeals.forEach(meal => {
      // Se for template ('Todos'), multiplica por 7 na visão semanal, ou 1 na diária
      // Nota: Simplificação. Idealmente verificaríamos overrides, mas para lista de compras, 
      // assumir o template como base é seguro para garantir que não falte comida.
      const multiplier = (meal.dayOfWeek === 'Todos' && (period === 'Semana' || period === 'Personalizado')) ? 7 : 1;

      if (meal.plate) {
        meal.plate.forEach(item => {
          const food = allFoods.find(f => String(f.id) === String(item.foodId));
          if (!food) return;

          if (!list[food.id]) {
            list[food.id] = {
              name: food.name,
              emoji: food.emoji,
              category: food.category,
              totalWeight: 0,
              originalItems: []
            };
          }

          // Calcula peso estimado em gramas/ml
          const unitWeight = getFoodUnitWeight(food, item.unit);
          const totalItemWeight = (unitWeight * item.quantity) * multiplier;
          
          list[food.id].totalWeight += totalItemWeight;
        });
      }
    });

    // Converte objeto em array e ordena por categoria/nome
    return Object.values(list)
      .filter(item => !hiddenItems[item.name])
      .sort((a, b) => {
        if (groupByCategory) {
            const catA = a.category || 'Outros';
            const catB = b.category || 'Outros';
            if (catA !== catB) return catA.localeCompare(catB);
        }
        return (a.name || '').localeCompare(b.name || '');
    });
  }, [meals, allFoods, period, selectedGroupKeys, groupByCategory, hiddenItems]);

  const hasCheckedItems = useMemo(() => Object.values(checkedItems).some(v => v), [checkedItems]);

  const handleShare = () => {
    const text = `🛒 *Lista de Compras - EvoluFit*\nPeríodo: ${period}\n\n` + 
      shoppingList.map(item => {
        const weightStr = item.totalWeight >= 1000 
          ? `${(item.totalWeight/1000).toFixed(1)}kg` 
          : `${Math.round(item.totalWeight)}g`;
        return `${item.emoji || ''} ${item.name}: aprox. ${weightStr}`;
      }).join('\n');
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    const text = shoppingList.map(item => `${item.name}: ${Math.round(item.totalWeight)}g`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Lista copiada para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce { 0% { transform: scale(0.95); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-scale-bounce">
        {/* Header */}
        <div className="p-4 border-b bg-emerald-600 text-white flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart size={20} />
            Lista de Compras
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-3 bg-gray-50 border-b flex gap-2 overflow-x-auto items-center">
            {['Semana', 'Hoje', 'Amanhã', 'Personalizado'].map(p => (
                <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${period === p ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
                >
                    {p}
                </button>
            ))}
            
            <div className="relative shrink-0">
                <select
                    value={['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].includes(period) ? period : ''}
                    onChange={(e) => setPeriod(e.target.value)}
                    className={`appearance-none pl-4 pr-8 py-1.5 rounded-lg text-xs font-bold transition-colors border outline-none cursor-pointer ${['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].includes(period) ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                    <option value="" disabled>Dia Específico</option>
                    {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                        <option key={day} value={day} className="text-gray-800 bg-white">{day}</option>
                    ))}
                </select>
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].includes(period) ? 'text-white' : 'text-gray-500'}`}>
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
        
        {/* Seleção de Grupos (Apenas no modo Personalizado) */}
        {period === 'Personalizado' && (
            <div className="bg-blue-50 p-3 border-b border-blue-100 max-h-40 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-800 flex items-center gap-1">
                        <Filter size={12} /> Selecione as Refeições:
                    </span>
                    <button onClick={selectAllGroups} className="text-[10px] font-bold text-blue-600 underline">
                        {selectedGroupKeys.size === mealGroups.length ? 'Desmarcar Todas' : 'Marcar Todas'}
                    </button>
                </div>
                <div className="space-y-1">
                    {mealGroups.map(group => (
                        <button 
                            key={group.key}
                            onClick={() => toggleGroup(group.key)}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${selectedGroupKeys.has(group.key) ? 'bg-white border border-blue-200 shadow-sm' : 'hover:bg-blue-100/50'}`}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedGroupKeys.has(group.key) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 bg-white'}`}>
                                {selectedGroupKeys.has(group.key) && <Check size={10} strokeWidth={4} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-gray-700 truncate">{group.name}</span>
                                    <span className="text-[10px] text-gray-500 ml-1">{group.time}</span>
                                </div>
                                <div className="text-[10px] text-gray-500 truncate">
                                    {group.isTemplate ? 'Todos os dias' : group.days.join(', ')}
                                </div>
                            </div>
                        </button>
                    ))}
                    {mealGroups.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Nenhuma refeição agendada.</p>}
                </div>
            </div>
        )}

        {/* Opções de Visualização */}
        <div className="px-4 py-2 bg-white border-b flex items-center justify-between">
            <button 
                onClick={() => setGroupByCategory(!groupByCategory)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${groupByCategory ? 'text-emerald-600' : 'text-gray-400'}`}
            >
                <Layers size={14} />
                {groupByCategory ? 'Agrupado por Categoria' : 'Lista Simples (A-Z)'}
            </button>
            <span className="text-[10px] text-gray-400 font-medium">
                {shoppingList.length} itens
            </span>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {shoppingList.length > 0 ? (
            shoppingList.map((item, index) => {
                const isChecked = checkedItems[item.name];
                const weightDisplay = item.totalWeight >= 1000 
                    ? `${(item.totalWeight/1000).toFixed(1).replace('.', ',')} kg` 
                    : `${Math.round(item.totalWeight)} g`;
                
                const showHeader = groupByCategory && (index === 0 || item.category !== shoppingList[index - 1].category);

                return (
                    <React.Fragment key={index}>
                        {showHeader && (
                            <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm px-2 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100 mt-3 mb-1 first:mt-0 rounded-md">
                                {item.category || 'Outros'}
                            </div>
                        )}
                        <div 
                        onClick={() => toggleCheck(item.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:border-emerald-200 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`text-emerald-500 ${isChecked ? 'text-gray-300' : ''}`}>
                                {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isChecked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                    {item.emoji} {item.name}
                                </p>
                                <p className="text-xs text-gray-500 font-medium">
                                    Estimado: {weightDisplay}
                                </p>
                            </div>
                        </div>
                    </div>
                    </React.Fragment>
                );
            })
          ) : (
            <div className="text-center py-10 text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                <p>Nenhum item encontrado para este período.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex gap-2">
          {hasCheckedItems && (
            <button onClick={handleClearChecked} className="py-2.5 px-4 bg-rose-100 text-rose-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-200" title="Limpar itens marcados">
              <Trash2 size={16} />
            </button>
          )}
          {!hasCheckedItems && hasHiddenItems && (
            <button onClick={handleRestoreHidden} className="py-2.5 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200" title="Restaurar itens excluídos">
              <Undo2 size={16} />
            </button>
          )}
          <button onClick={handleCopy} className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100">
            <Copy size={16} /> Copiar
          </button>
          <button onClick={handleShare} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-md">
            <Share2 size={16} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListModal;