
import React from 'react';
import { LayoutGrid, ChefHat, BrainCircuit, CalendarClock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'pantry' | 'plate' | 'schedule' | 'brain';
  onTabChange: (tab: any) => void;
  plateCount?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, plateCount = 0 }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      <header className="bg-emerald-600 text-white p-4 pt-8 text-center font-bold text-xl shadow-md z-10">
        <span className="tracking-tighter">NUTRI BRASIL</span>
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

const NavButton = ({ active, onClick, icon, label, badge }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center transition-all relative ${active ? 'text-emerald-600 scale-110' : 'text-gray-300 hover:text-gray-400'}`}>
    {icon}
    {badge !== undefined && (
      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
        {badge}
      </span>
    )}
    <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">{label}</span>
  </button>
);
