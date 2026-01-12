import React, { useMemo } from 'react';
import { LayoutGrid, ChefHat, BrainCircuit, CalendarClock, RefreshCw, BookOpen, Download, ClipboardList, FileDown, Sun, Moon, ShoppingCart, Trophy, Heart, Crown } from 'lucide-react';

const HeaderButton = ({ onClick, title, children }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-emerald-700 transition-colors flex-1 min-w-0" title={title}>
    {children}
  </button>
);

export const Layout = ({ children, activeTab, onTabChange, plateCount = 0, onRestartTour, onToggleManual, onInstallClick, showInstallButton, onToggleSummary, onToggleShoppingList, onExportPDF, currentTheme, onThemeChange, gamification, level, allBadges, accessStatus, isRealAdmin, onDebugToggle }) => {
  const unlockedBadges = useMemo(() => {
    if (!gamification || !allBadges) return [];
    return allBadges.filter(b => (gamification.achievements || []).includes(b.id));
  }, [gamification, allBadges]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white dark:bg-gray-900 shadow-2xl relative overflow-hidden">
      <header className="bg-emerald-600 text-white p-2 pt-4 flex flex-col items-center shadow-md z-10 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm tracking-tighter opacity-90">EvoluFit</span>
          {(accessStatus === 'premium' || accessStatus === 'admin') ? (
            <div 
              onClick={isRealAdmin ? onDebugToggle : undefined}
              className={`flex items-center gap-0.5 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full text-[8px] font-black shadow-sm animate-fade-in ${isRealAdmin ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              title={isRealAdmin ? "Admin: Clique para alternar visualização (Premium/Trial)" : ""}
            >
              <Crown size={10} fill="currentColor" />
              <span>PRO</span>
            </div>
          ) : (
            <div 
              onClick={isRealAdmin ? onDebugToggle : undefined}
              className={`bg-white/20 text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold border border-white/30 animate-fade-in ${isRealAdmin ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              title={isRealAdmin ? "Admin: Clique para alternar visualização" : ""}
            >
              TRIAL
            </div>
          )}
        </div>
        <div className="flex items-center justify-between w-full px-1 gap-1">
          {showInstallButton && (
            <HeaderButton onClick={onInstallClick} title="Instale o App">
              <Download size={18} />
              <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5 text-center leading-none">Instale<br/>o App</span>
            </HeaderButton>
          )}
          {onExportPDF && (
            <HeaderButton onClick={onExportPDF} title="Exportar para PDF">
              <FileDown size={18} />
              <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">PDF</span>
            </HeaderButton>
          )}
          <HeaderButton onClick={onToggleShoppingList} title="Lista de Compras">
            <ShoppingCart size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5 text-center leading-none">Lista</span>
          </HeaderButton>
          <HeaderButton onClick={onToggleSummary} title="Agendadas">
            <ClipboardList size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5 text-center leading-none">Agendadas</span>
          </HeaderButton>
          <HeaderButton onClick={onRestartTour} title="Reiniciar Tour">
            <RefreshCw size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Tour</span>
          </HeaderButton>
          <HeaderButton onClick={() => onThemeChange(currentTheme === 'dark' ? 'light' : 'dark')} title="Alternar Tema">
            {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Tema</span>
          </HeaderButton>
          <HeaderButton onClick={onToggleManual} title="Manual de Uso">
            <BookOpen size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Manual</span>
          </HeaderButton>
        </div>
      </header>

      {/* Barra de Resumo de Gamificação */}
      {gamification && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-3 py-2 flex items-center justify-between shadow-sm z-10 shrink-0 gap-2">
           {/* Nível */}
           <div className="flex items-center gap-2 min-w-0">
              <div className="text-xl">{level?.icon || '🌱'}</div>
              <div className="flex flex-col">
                 <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider leading-none">Nível</span>
                 <span className="text-xs font-black text-gray-800 dark:text-gray-100 truncate leading-tight">{level?.title || 'Novato'}</span>
              </div>
           </div>

           {/* Corações */}
           <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-800">
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span className="text-xs font-black text-rose-600 dark:text-rose-400">{gamification.hearts || 0}</span>
           </div>

           {/* Troféus (Scroll Horizontal) */}
           <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[120px] justify-end">
              {unlockedBadges.length > 0 ? (
                unlockedBadges.map(badge => (
                  <div key={badge.id} className="text-sm shrink-0" title={badge.name}>
                    {badge.icon}
                  </div>
                ))
              ) : (
                <Trophy size={14} className="text-gray-300" />
              )}
           </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-28 scroll-smooth bg-gray-50/30 dark:bg-gray-900">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-around p-4 z-50">
        <NavButton active={activeTab === 'pantry'} onClick={() => onTabChange('pantry')} icon={<LayoutGrid size={22}/>} label="Dispensa" />
        <NavButton 
          active={activeTab === 'plate'} 
          onClick={() => onTabChange('plate')} 
          icon={<ChefHat size={22}/>} 
          label="Prato" 
          badge={plateCount > 0 ? plateCount : undefined}
        />
        <NavButton active={activeTab === 'schedule'} onClick={() => onTabChange('schedule')} icon={<CalendarClock size={22}/>} label="Agenda" />
        <NavButton active={activeTab === 'brain'} onClick={() => onTabChange('brain')} icon={<BrainCircuit size={22}/>} label="Cérebro" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, badge }) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all relative ${active ? 'text-emerald-600 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500'}`}>
    {icon}
    {badge !== undefined && (
      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
        {badge}
      </span>
    )}
    <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
  </button>
);
