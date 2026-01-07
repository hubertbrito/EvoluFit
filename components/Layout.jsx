import React from 'react';
import { LayoutGrid, ChefHat, BrainCircuit, CalendarClock, RefreshCw, BookOpen, Download, ClipboardList, FileDown, Sun, Moon, ShoppingCart } from 'lucide-react';

const HeaderButton = ({ onClick, title, children }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-emerald-700 transition-colors w-11" title={title}>
    {children}
  </button>
);

export const Layout = ({ children, activeTab, onTabChange, plateCount = 0, onRestartTour, onToggleManual, onInstallClick, showInstallButton, onToggleSummary, onToggleShoppingList, onExportPDF, currentTheme, onThemeChange }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      <header className="bg-emerald-600 text-white p-4 pt-8 flex items-center justify-between shadow-md z-10">
        <span className="font-bold text-xl tracking-tighter">EvoluFit</span>
        <div className="flex items-center gap-0.5">
          {showInstallButton && (
            <HeaderButton onClick={onInstallClick} title="Instalar App">
              <Download size={18} />
              <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Instalar</span>
            </HeaderButton>
          )}
          {onExportPDF && (
            <HeaderButton onClick={onExportPDF} title="Exportar para PDF">
              <FileDown size={18} />
              <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">PDF</span>
            </HeaderButton>
          )}
          <HeaderButton onClick={onToggleSummary} title="Resumo da Agenda">
            <ClipboardList size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Resumo</span>
          </HeaderButton>
          <HeaderButton onClick={onToggleShoppingList} title="Lista de Compras">
            <ShoppingCart size={18} />
            <span className="text-[8px] font-bold uppercase tracking-tighter mt-0.5">Lista</span>
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

      <main className="flex-1 overflow-y-auto pb-28 scroll-smooth bg-gray-50/30">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around p-4 z-50">
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
  <button onClick={onClick} className={`flex flex-col items-center transition-all relative ${active ? 'text-emerald-600 scale-110' : 'text-gray-500 hover:text-emerald-600'}`}>
    {icon}
    {badge !== undefined && (
      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
        {badge}
      </span>
    )}
    <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
  </button>
);
