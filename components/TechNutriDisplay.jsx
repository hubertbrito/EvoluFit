import React from 'react';
import { Activity, Zap, Dumbbell, Wheat, Droplet } from 'lucide-react';

const DigitalValue = ({ label, value, unit, colorClass, Icon }) => (
  <div className="flex flex-col items-center px-1 min-w-[3rem]">
    <div className="flex items-center gap-1 mb-0.5">
      {Icon && <Icon size={10} className={colorClass} />}
      <span className="text-[10px] font-bold uppercase text-gray-500">{label}</span>
    </div>
    <div className={`font-mono text-lg leading-none font-black ${colorClass} drop-shadow-sm`}>
      {Math.round(value)}
      <span className="text-[10px] ml-0.5 opacity-70">{unit}</span>
    </div>
  </div>
);

const TechNutriDisplay = ({ lastFood, totalNutrition, isOverLimit, activeTab }) => {
  // Define a cor do total: Verde (Padrão) ou Vermelho Neon (Se ultrapassar a meta)
  const totalColorClass = isOverLimit ? "text-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] animate-pulse" : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xl animate-fade-in">
      {/* Linha de Scan decorativa */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50"></div>
      
      <div className="w-full">
        {activeTab === 'pantry' && (
          /* Lado Esquerdo: Último Selecionado (Individual 100g) */
          <div className="py-3 px-4 flex items-center justify-between relative overflow-hidden w-full">
            <div className="absolute top-0 left-0 w-0.5 h-full bg-cyan-500/20"></div>
            
            <div className="flex flex-col max-w-[45%]">
                <h3 className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Activity size={12} /> Individual (100g)
                </h3>
                <p className="text-xs text-gray-800 dark:text-white font-bold truncate leading-tight">
                    {lastFood ? lastFood.name : <span className="text-gray-400 dark:text-gray-500 italic">Selecione...</span>}
                </p>
            </div>
            
            {lastFood && (
              <div className="flex items-center justify-between gap-1 bg-gray-100 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700/50 w-full">
                  <DigitalValue label="Kcal" value={lastFood.calories} unit="" colorClass="text-cyan-600 dark:text-cyan-400" Icon={Zap} />
                  <DigitalValue label="Prot" value={lastFood.protein} unit="g" colorClass="text-rose-600 dark:text-rose-400" Icon={Dumbbell} />
                  <DigitalValue label="Carb" value={lastFood.carbs} unit="g" colorClass="text-blue-600 dark:text-blue-400" Icon={Wheat} />
                  <DigitalValue label="Lip" value={lastFood.fat} unit="g" colorClass="text-yellow-600 dark:text-yellow-400" Icon={Droplet} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'plate' && (
          /* Lado Direito: Total do Prato (Soma) */
          <div className="py-3 px-4 flex items-center justify-between relative overflow-hidden bg-white dark:bg-gray-900 w-full">
            <div className="absolute top-0 right-0 w-0.5 h-full bg-emerald-500/20"></div>
            
            <div className="flex flex-col max-w-[45%]">
                <h3 className={`text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5 ${isOverLimit ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  <Zap size={12} /> Total Acumulado
                </h3>
                <p className="text-xs text-gray-800 dark:text-white font-bold truncate leading-tight">Prato Atual</p>
            </div>
            
            <div className="flex items-center justify-between gap-1 bg-gray-100 dark:bg-gray-800/50 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700/50 w-full">
                <DigitalValue label="Kcal" value={totalNutrition.calories} unit="" colorClass={totalColorClass} Icon={Zap} />
                <DigitalValue label="Prot" value={totalNutrition.protein} unit="g" colorClass={isOverLimit ? totalColorClass : "text-rose-600 dark:text-rose-400"} Icon={Dumbbell} />
                <DigitalValue label="Carb" value={totalNutrition.carbs} unit="g" colorClass={isOverLimit ? totalColorClass : "text-blue-600 dark:text-blue-400"} Icon={Wheat} />
                <DigitalValue label="Lip" value={totalNutrition.fat} unit="g" colorClass={isOverLimit ? totalColorClass : "text-yellow-600 dark:text-yellow-400"} Icon={Droplet} />
            </div>
          </div>
        )}
      </div>

      {/* Fonte de Dados */}
      <div className="text-[8px] text-gray-400 dark:text-yellow-50/90 text-center pb-1 uppercase tracking-wider font-bold px-4 leading-tight">
        Fonte: Tabela TACO/UNICAMP • Referência Oficial
      </div>
      
      {/* Barra de Status Inferior */}
      <div className="h-px w-full bg-gradient-to-r from-cyan-100 via-gray-300 to-emerald-100 dark:from-cyan-900 dark:via-gray-800 dark:to-emerald-900"></div>
    </div>
  );
};

export default TechNutriDisplay;