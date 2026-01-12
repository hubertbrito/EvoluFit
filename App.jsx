import React, { useState, useEffect } from 'react';
import { X, Trash2, Copy, AlertTriangle, Eraser, Download, Loader } from 'lucide-react';
import EducationalModal from './components/EducationalModal';
import { FOOD_DATABASE, UNIT_WEIGHTS, getFoodUnitWeight, inferFoodMeasures, inferNutrients } from './constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { populateDB } from './db.js';
import PantryScreen from './components/PantryScreen';
import PlateScreen from './components/PlateScreen';
import BrainScreen from './components/BrainScreen';
import educationalData from './educationalData';
import ScheduleScreen from './components/ScheduleScreen';
import FoodAddedModal from './components/FoodAddedModal';
import ScheduleSummaryModal from './components/ScheduleSummaryModal';
import ShoppingListModal from './components/ShoppingListModal';
import SetupScreen from './components/SetupScreen';
import SchedulePdfView from './components/SchedulePdfView';
import { Layout } from './components/Layout';
import CalorieAlertModal from './components/CalorieAlertModal';
import GoalReachedModal from './components/GoalReachedModal';
import TrialEndScreen from './components/TrialEndScreen';
import WaterGoalModal from './components/WaterGoalModal';
import WelcomeScreen from './components/WelcomeScreen';

// Definindo localmente para não depender de arquivo de tipos externo
const Category = { INDUSTRIALIZADOS: 'Industrializados' };

const BADGES_DATA = [
  { id: 'first_step', name: 'Primeiro Passo', description: 'Registrou a primeira refeição.', icon: '🦶', category: 'level' },
  { id: 'streak_3', name: 'Aquecendo', description: 'Manteve o foco por 3 dias seguidos.', icon: '🔥', category: 'level' },
  { id: 'streak_7', name: 'Semana Imbatível', description: '7 dias de constância total.', icon: '🏆', category: 'level' },
  { id: 'streak_30', name: 'Iniciado', description: '1 mês de foco! O hábito está formado.', icon: '🧘', category: 'level' },
  { id: 'streak_60', name: 'Mestre', description: '2 meses de disciplina absoluta.', icon: '🥋', category: 'level' },
  { id: 'streak_90', name: 'Monge', description: '3 meses. Sua mente controla seu corpo.', icon: '📿', category: 'level' },
  { id: 'streak_120', name: 'O Iluminado', description: '4 meses. Você transcendeu a dieta.', icon: '✨', category: 'level' },
  { id: 'water_master', name: 'Fluxo Vital', description: 'Manteve a hidratação ideal por 3 dias seguidos.', icon: '💧', category: 'water' },
  { id: 'heart_10', name: 'Despertar', description: 'Conquistou 10 corações com escolhas saudáveis.', icon: '💙', category: 'heart' },
  { id: 'heart_50', name: 'Equilíbrio', description: '50 corações! Suas células agradecem.', icon: '💖', category: 'heart' },
  { id: 'heart_100', name: 'Vitalidade', description: '100 corações. Você domina a arte de comer.', icon: '👑', category: 'heart' },
  { id: 'heart_120', name: 'Plenitude', description: '120 corações. Você é um exemplo de constância!', icon: '🏆', category: 'heart' },
  { id: 'heart_150', name: 'Quebrou a\nMatrix', description: '150 corações. Prêmio Secreto Desbloqueado!', icon: '💎', category: 'heart' },
];

const LEVELS = [
  { days: 0, title: 'Novato', icon: '🌱' },
  { days: 30, title: 'Iniciado', icon: '🧘' },
  { days: 60, title: 'Mestre', icon: '🥋' },
  { days: 90, title: 'Monge', icon: '📿' },
  { days: 120, title: 'O Iluminado', icon: '✨' }
];

const DEFAULT_MEAL_SCHEDULE = [
  { id: 'm1', name: 'Café da Manhã', time: '08:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm2', name: 'Lanche das 10h', time: '10:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm3', name: 'Almoço', time: '12:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm4', name: 'Chá das Três', time: '15:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm5', name: 'Lanche das 17h', time: '17:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm6', name: 'Jantar das 20h', time: '20:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm7', name: 'Lanche das 22h', time: '22:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
  { id: 'm8', name: 'Ceia da Meia-noite', time: '00:00', plate: [], isDone: false, dayOfWeek: 'Todos' },
];

const TourOverlay = ({ step, onNext, onBack, onSkip, highlightedRect }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isBouncing, setIsBouncing] = useState(true);

  // Reseta a posição (drag) e ativa o bounce quando o passo muda
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsBouncing(true);
    const timer = setTimeout(() => setIsBouncing(false), 400); // Duração da animação
    return () => clearTimeout(timer);
  }, [step]);


  const steps = [
    {
      title: "Bem-vindo ao EvoluFit!",
      content: "Seu perfil foi configurado com sucesso! Vamos fazer um tour rápido para você dominar o aplicativo e atingir suas metas?",
      action: "Começar Tour",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "1. Sua Dispensa",
      content: "Aqui você encontra todos os alimentos. Use a busca ou o microfone para encontrar o que vai comer. Clique no '+' ou no alimento para adicioná-lo ao seu Prato.",
      action: "Próximo",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "2. Montando o Prato",
      content: "Aqui na aba 'Prato', você definirá a quantidade exata (ex: 2 colheres) de cada alimento selecionado. O app calcula as calorias em tempo real.",
      action: "Entendi",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "3. Agendando",
      content: "Depois de montar o prato, use os botões abaixo para escolher os dias e a refeição (ex: Almoço) onde esse prato será servido.",
      action: "Próximo",
      positionClass: "top-24 right-4"
    },
    {
      title: "4. Sua Agenda",
      content: "Aqui fica seu planejamento completo. Você visualiza todas as refeições do dia e seus horários.",
      action: "Próximo",
      positionClass: "bottom-24 right-4"
    },
    {
      title: "5. Criando Refeições",
      content: "Para criar uma nova refeição (ex: Lanche Extra), a regra é: PRIMEIRO selecione os dias no menu superior, e SÓ DEPOIS clique em 'Adicionar Refeição'.",
      action: "Importante!",
      positionClass: "top-24 right-4"
    },
    {
      title: "6. Fluxo Inverso",
      content: "Você também pode criar uma refeição vazia na Agenda primeiro, e depois ir ao Prato e escolher 'Inserir em...' para preenchê-la.",
      action: "Finalizar",
      positionClass: "bottom-24 right-4"
    }
  ];

  const handleMouseDown = (e) => {
    // Evita arrastar se clicar em botões
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    };
    const handleMouseUp = (e) => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const current = steps[step];

  // The modal window JSX
  const Modal = (
    <div 
      className={`absolute pointer-events-auto transition-all duration-500 ease-in-out ${!highlightedRect ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : current.positionClass}`}
      style={highlightedRect ? { transform: `translate(${position.x}px, ${position.y}px)` } : {}}
    >
      <div 
        className={`bg-white rounded-2xl p-4 max-w-xs w-full shadow-xl border-2 border-emerald-500 cursor-move ${isBouncing ? 'animate-scale-bounce' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <button 
          onClick={onSkip} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          title="Fechar Tour"
        >
          <X size={16} />
        </button>

        <div className="mb-3">
            <h3 className="text-sm font-black text-emerald-600 mb-1">{current.title}</h3>
            <p className="text-gray-600 text-xs leading-relaxed">{current.content}</p>
        </div>
        <div className="flex gap-2 mt-2">
            {step > 0 && <button onClick={onBack} className="flex-1 py-1.5 rounded-lg font-bold text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Voltar</button>}
            <button onClick={onNext} className="flex-2 w-full py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 transition-transform transform active:scale-95">{current.action}</button>
        </div>
        <div className="flex justify-center gap-1 mt-2">{steps.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === step ? 'bg-emerald-500' : 'bg-gray-200'}`} />)}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      {/* Spotlight effect */}
      {highlightedRect ? (
        <>
          <div className="fixed bg-black/70" style={{ top: 0, left: 0, width: '100%', height: highlightedRect.top }} />
          <div className="fixed bg-black/70" style={{ top: highlightedRect.bottom, left: 0, width: '100%', bottom: 0 }} />
          <div className="fixed bg-black/70" style={{ top: highlightedRect.top, left: 0, width: highlightedRect.left, height: highlightedRect.height }} />
          <div className="fixed bg-black/70" style={{ top: highlightedRect.top, left: highlightedRect.right, right: 0, height: highlightedRect.height }} />
        </>
      ) : (
        // Fallback dark background if no element is highlighted
        <div className="fixed inset-0 bg-black/70" />
      )}
      
      {/* The modal itself */}
      {Modal}
    </div>
  );
};

const HeartExplosion = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[210] flex items-center justify-center">
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-20px) scale(1.2); }
          100% { transform: translateY(-200px) scale(1); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl drop-shadow-md"
          style={{
            left: `${50 + (Math.random() * 60 - 30)}%`,
            top: `${50 + (Math.random() * 60 - 30)}%`,
            animation: `float-up ${1 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        >
          ❤️
        </div>
      ))}
      <div className="absolute text-2xl font-black text-rose-500 bg-white/90 px-4 py-2 rounded-full shadow-xl animate-bounce border-2 border-rose-200">
        +1 Coração!
      </div>
    </div>
  );
};

const ClappingFeedback = ({ message }) => (
  <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-4 animate-bounce">
    <div className="text-4xl">👏</div>
    <div>
      <h3 className="text-lg font-black text-emerald-700 leading-none">Mandou Bem!</h3>
      <p className="text-xs font-bold text-emerald-600/80">{message || "Refeição registrada."}</p>
    </div>
  </div>
);

const ManualScreen = ({ onClose, onReset, onInstallClick, showInstallButton }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <style>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
      .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      @keyframes scale-bounce {
        0% { transform: scale(0.95); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
    `}</style>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-scale-bounce">
      <div className="p-4 border-b flex justify-between items-center bg-emerald-50">
        <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
          📖 Manual de Uso
        </h2>
        <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-600 leading-relaxed">
        <div className="space-y-3 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 text-base">Guia da Nova Era Alimentar: O Despertar da Nutrição Naturalista</h3>
          
          <div className="space-y-2">
            <h4 className="font-bold text-purple-900">Introdução: O Fim dos Mitos</h4>
            <p className="text-purple-800">
              Bem-vindo a uma nova forma de enxergar o seu corpo. Em janeiro de 2026, as diretrizes alimentares globais (lideradas pelo USDA e FDA) passaram pela maior transformação das últimas décadas. O que antes era considerado o "padrão" foi invertido. O foco saiu da contagem obsessiva de calorias e entrou na Densidade Nutricional e no Conhecimento Naturalista. Este manual explica como o nosso app agora te ajuda a navegar nessa nova realidade.
            </p>
          </div>
          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">1. A Inversão da Pirâmide: Por que Proteína é a Base?</h4>
            <p className="text-purple-800">
              Durante anos, fomos ensinados que a base da alimentação eram os carboidratos (pães, massas, cereais). A ciência de 2026 provou o contrário: a base da saúde humana é a Proteína de alta qualidade (carnes, ovos, peixes e vegetais proteicos) e as Gorduras Naturais.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>O Superpoder da Proteína:</strong> Diferente dos carboidratos refinados, a proteína possui um alto Efeito Térmico. Isso significa que seu corpo queima energia apenas para digeri-la.</li>
              <li><strong>A Saciedade Real:</strong> A proteína regula os hormônios da fome (como a grelina). Quando você prioriza a proteína, você envia uma mensagem de "segurança" ao seu cérebro, permitindo que você coma um volume maior de comida e, ainda assim, perca gordura ou mantenha o peso com facilidade.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">2. Comida de Verdade vs. Ultraprocessados</h4>
            <p className="text-purple-800">
              O conceito naturalista adotado pelo app separa o que é "combustível" do que é "distração".
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>Alimentos de Verdade:</strong> São aqueles que a natureza entrega prontos (ou quase prontos). Carnes, frutas, vegetais, raízes e sementes. Eles contêm a matriz de informação que suas células reconhecem.</li>
              <li><strong>O Perigo dos Invisíveis:</strong> Açúcares adicionados e aditivos químicos "sequestram" seu paladar e desligam sua saciedade. As novas diretrizes de 2026 recomendam a redução drástica de itens de pacote (ultraprocessados), que inflamam o corpo e causam neblina mental.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">3. Volume Inteligente: Coma Mais, Nutra Melhor</h4>
            <p className="text-purple-800">
              A grande revelação desta nova era é que comer pouco não é sinônimo de saúde. O segredo está no volume inteligente. Ao preencher seu prato com alimentos densos (proteínas e fibras), você ocupa espaço físico no estômago e nutre suas células profundamente. O resultado? Você se sente satisfeito por muito mais tempo e elimina a necessidade de "beliscar" alimentos processados ao longo do dia.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">4. Como o App te Guia (A Didática Subjetiva)</h4>
            <p className="text-purple-800">
              Nossa plataforma não vai apenas registrar o que você come. Ela vai te ensinar enquanto você navega:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>Na sua Dispensa:</strong> Identificamos o que é aliado e o que é distração, te ensinando a ler rótulos de forma invisível.</li>
              <li><strong>No seu Prato:</strong> Celebramos quando você escolhe a proteína primeiro, validando sua inteligência biológica.</li>
              <li><strong>Na sua Agenda:</strong> Mostramos como a constância na "comida de verdade" transforma seu gráfico de energia e saúde.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">5. Conclusão: Autonomia e Liberdade</h4>
            <p className="text-purple-800">
              O objetivo final não é te prender a uma dieta, mas te dar Conhecimento Naturalista. Quando você entende como a proteína e os alimentos naturais funcionam, você ganha liberdade. Você para de lutar contra a balança e começa a trabalhar a favor da sua biologia.
            </p>
            <p className="text-purple-800 font-bold mt-2">
              Lembre-se: Cada escolha por um alimento real é um voto em uma versão mais forte, lúcida e vibrante de você mesmo. Estamos aqui para garantir que você vença essa jornada através do conhecimento.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-purple-200">
            <h4 className="font-bold text-purple-900">6. O Jogo da Evolução (Gamificação)</h4>
            <p className="text-purple-800">
              O EvoluFit reconhece sua dedicação. Transformamos sua constância em um jogo de evolução pessoal.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-purple-800">
              <li><strong>Níveis de Consciência:</strong> Seu nível é definido pela sua maior sequência de dias (Streak) mantendo o foco.
                <ul className="list-none pl-4 mt-1 text-[10px] space-y-0.5 opacity-90">
                  <li>🌱 <strong>Novato (0-29 dias):</strong> O começo da jornada.</li>
                  <li>🧘 <strong>Iniciado (30 dias):</strong> O hábito está se formando.</li>
                  <li>🥋 <strong>Mestre (60 dias):</strong> Disciplina e controle.</li>
                  <li>📿 <strong>Monge (90 dias):</strong> Sua mente comanda o corpo.</li>
                  <li>✨ <strong>O Iluminado (120+ dias):</strong> Transcendência nutricional.</li>
                </ul>
              </li>
              <li><strong>Como Evoluir:</strong> Basta registrar suas refeições diariamente. Se perder um dia, seu "Fogo" (Streak atual) apaga, mas seu Nível (baseado no recorde) permanece como um marco da sua história.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-emerald-700 text-base">Funcionalidades Detalhadas</h3>
          <ul className="list-disc list-inside space-y-2 pl-1 grid grid-cols-1 gap-1">
            <li><strong>1. Dispensa e Busca:</strong> Encontre alimentos por nome ou comando de voz 🎤.</li>
            <li><strong>2. Filtros Inteligentes:</strong> Filtre por categorias ou dietas (Low Carb, Vegana, etc).</li>
            <li><strong>3. Montagem de Prato:</strong> Adicione itens e ajuste medidas caseiras com cálculo automático.</li>
            <li><strong>4. Agendamento:</strong> Defina se o prato é para dias específicos ou para a semana toda.</li>
            <li><strong>5. Agenda Interativa:</strong> Arraste e solte cards para reordenar. Marque como "Feito".</li>
            <li><strong>6. Edição e Duplicação:</strong> Edite pratos criados ou duplique refeições para outros dias.</li>
            <li><strong>7. Contexto Social:</strong> Registre onde e com quem você vai comer (ex: "Jantar com amigos").</li>
            <li><strong>8. Lista de Compras:</strong> Gere uma lista automática baseada no seu planejamento.</li>
            <li><strong>9. Resumo da Agenda:</strong> Visualize um resumo compacto de todas as refeições.</li>
            <li><strong>10. Controle de Água:</strong> Registre consumo e acompanhe a meta diária com histórico.</li>
            <li><strong>11. Cérebro e Metas:</strong> Relatório do seu metabolismo (TMB), gasto calórico e progresso.</li>
            <li><strong>12. Alertas:</strong> Receba avisos visuais e sonoros na hora de comer (com app aberto).</li>
            <li><strong>13. Modo Escuro:</strong> Alterne entre tema claro e escuro para conforto visual.</li>
            <li><strong>14. Exportar PDF:</strong> Salve ou imprima seu planejamento alimentar.</li>
            <li><strong>15. Offline:</strong> Funciona sem internet após o primeiro acesso (exceto busca por voz).</li>
            <li><strong>16. Reset e Ajustes:</strong> Redefina sua agenda ou atualize seu perfil a qualquer momento.</li>
            <li><strong>17. Gamificação:</strong> Suba de nível e desbloqueie conquistas mantendo a constância.</li>
          </ul>
        </div>

        <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 text-base">Instalação e Atualização</h3>
          
          <div className="space-y-2">
            <p className="font-bold text-blue-900">Como Instalar:</p>
            <p className="text-blue-700">
              O EvoluFit funciona como um aplicativo nativo. Não é necessário baixar de uma loja.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1 text-blue-700">
              <li><strong>Android (Chrome):</strong> Toque nos três pontinhos (⋮) no canto superior direito e selecione "Adicionar à tela inicial" ou "Instalar aplicativo".</li>
              <li><strong>iOS (Safari):</strong> Toque no ícone de Compartilhamento (quadrado com seta) e selecione "Adicionar à Tela de Início".</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-blue-200">
            <p className="font-bold text-blue-900">Como Atualizar:</p>
            <p className="text-blue-700">
              Para receber novas funcionalidades (como a Lista de Compras ou Modo Escuro), você não precisa reinstalar.
            </p>
            <p className="text-blue-700">
              <strong>O segredo é:</strong> Acesse o EvoluFit pelo navegador (site) conectado à internet ocasionalmente. Isso baixa a versão mais recente automaticamente. Na próxima vez que abrir o app instalado, ele já estará atualizado.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
        {showInstallButton && (
          <button onClick={onInstallClick} className="text-emerald-600 text-xs font-bold hover:text-emerald-800 underline flex items-center gap-1"><Download size={14}/> Instalar App</button>
        )}
        <button onClick={onReset} className="text-rose-500 text-xs font-bold hover:text-rose-700 underline">
          Resetar Agenda
        </button>
        <button onClick={onClose} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-transform active:scale-95 shadow-md">
          Fechar Manual
        </button>
      </div>
    </div>
  </div>
);

const AddMealModal = ({ onClose, onConfirm, title, buttonLabel, mealToEdit, context }) => {
  const [selectedDays, setSelectedDays] = useState(
    context && context !== 'Datas Marcadas' && context !== 'Todos' ? [context] : []
  );
  const [time, setTime] = useState(mealToEdit ? mealToEdit.time : '14:00');
  const [specificDate, setSpecificDate] = useState('');
  const [repeatCount, setRepeatCount] = useState(1);
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    if (context === 'Datas Marcadas') {
        if (!specificDate) return alert('Selecione uma data.');
        onConfirm(['Datas Marcadas'], time, specificDate, repeatCount);
    } else {
        if (selectedDays.length === 0) return alert('Selecione pelo menos um dia.');
        onConfirm(selectedDays, time);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes scale-bounce {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800">{title || "Adicionar Nova Refeição"}</h3>
          <button onClick={onClose}><X size={20} className="text-emerald-600" /></button>
        </div>
        <div className="p-6">
          {mealToEdit && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Horário da Refeição</label>
              <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-gray-900"
              />
            </div>
          )}
          
          {context === 'Datas Marcadas' ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Data Inicial</label>
                <input 
                    type="date" 
                    value={specificDate} 
                    onChange={(e) => setSpecificDate(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-gray-900"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-1">Repetir por (dias)</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="number" 
                        min="1" 
                        max="30"
                        value={repeatCount} 
                        onChange={(e) => setRepeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 p-2 border rounded-lg bg-white text-center font-bold text-emerald-600"
                    />
                    <span className="text-xs text-gray-500">
                        {repeatCount > 1 ? `Criar refeições até ${(() => {
                            if (!specificDate) return '...';
                            const d = new Date(specificDate + 'T00:00:00');
                            d.setDate(d.getDate() + repeatCount - 1);
                            return d.toLocaleDateString('pt-BR');
                        })()}` : 'Apenas nesta data'}
                    </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">Selecione os dias para esta refeição:</p>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setSelectedDays(days)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Todos os Dias</button>
                <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Limpar</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {days.map(day => (
                  <button key={day} onClick={() => toggleDay(day)} className={`p-2 rounded-lg text-xs font-bold transition-colors ${selectedDays.includes(day) ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-emerald-700">{buttonLabel || "Criar"}</button>
        </div>
      </div>
    </div>
  );
};

const DeleteMealModal = ({ onClose, onConfirm, onDuplicate, meal, contextDay }) => {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const isTodos = meal.dayOfWeek === 'Todos';
  
  const [selectedDays, setSelectedDays] = useState(
    isTodos 
      ? (contextDay && days.includes(contextDay) ? [contextDay] : days)
      : [meal.dayOfWeek]
  );

  const toggleDay = (day) => {
    if (!isTodos) return;
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0) return alert('Selecione pelo menos um dia para excluir.');
    onConfirm(selectedDays);
    onClose();
  };

  return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <style>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
      .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      @keyframes scale-bounce {
        0% { transform: scale(0.95); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .animate-scale-bounce { animation: scale-bounce 0.4s ease-out; }
    `}</style>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
      <div className="p-4 border-b bg-rose-50 flex justify-between items-center">
        <h3 className="font-bold text-rose-800">Excluir Refeição</h3>
        <button onClick={onClose}><X size={20} className="text-rose-600" /></button>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4 text-sm">
          Selecione os dias para excluir a refeição <strong>"{meal.name}"</strong>:
        </p>
        
        {isTodos && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => setSelectedDays(days)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100">Todos os Dias</button>
            <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Limpar</button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {days.map(day => (
            <button 
              key={day} 
              onClick={() => toggleDay(day)} 
              disabled={!isTodos && day !== meal.dayOfWeek}
              className={`p-2 rounded-lg text-xs font-bold transition-colors 
                ${selectedDays.includes(day) 
                  ? 'bg-rose-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                ${(!isTodos && day !== meal.dayOfWeek) ? 'opacity-30 cursor-not-allowed' : ''}
              `}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
        <button 
          onClick={onDuplicate} 
          className="mr-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 flex items-center gap-2"
        >
          <Copy size={16} /> Duplicar
        </button>
        <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
        <button onClick={handleConfirm} className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-rose-700">Excluir</button>
      </div>
    </div>
  </div>
  );
};

const WhatsNewModal = ({ onClose, onOpenManual }) => {
  const features = [
    "📅 Arraste e Solte na Agenda: Reorganize suas refeições facilmente.",
    "📤 Compartilhar Cardápio: Envie seu planejamento do dia pelo WhatsApp.",
    "💡 Sugestão de Alimentos: Não achou algo? Sugira diretamente pelo app.",
    "🍎 Categoria 'Meus Alimentos': Seus itens personalizados agora têm casa própria.",
    "💧 Histórico de Água: Acompanhe sua hidratação nos últimos 7 dias.",
    "🗑️ Lixeira Inteligente: Exclua itens da dispensa ou alimentos personalizados."
  ];
  
  const newFoods = [
    "Saputi", "Tamarindo", "Pão de Batata", "Bolo de Milho", "Salgados de Festa", "Pratos Feitos", "E mais 50 itens!"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
          <h3 className="font-bold text-emerald-800 flex items-center gap-2">
            ✨ Novidades da Atualização
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <h4 className="font-bold text-emerald-700 mb-2 text-sm uppercase">Novas Funcionalidades</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1.5">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold text-emerald-700 mb-2 text-sm uppercase">Novos Alimentos</h4>
            <div className="flex flex-wrap gap-2">
              {newFoods.map((f, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-100">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed">
            <strong>Dica:</strong> Consulte o <strong>Manual de Uso</strong> para aprender a usar todas essas novidades detalhadamente.
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button 
            onClick={() => { onClose(); onOpenManual(); }}
            className="px-4 py-2 text-emerald-600 font-bold text-xs hover:bg-emerald-50 rounded-lg transition-colors"
          >
            Ver Manual
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-xs hover:bg-emerald-700 transition-transform active:scale-95 shadow-md"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

const Confetti = () => {
  const confettiCount = 100;
  const colors = ['#fde047', '#f87171', '#4ade80', '#60a5fa', '#a78bfa'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 16px;
          animation: fall 3s linear forwards;
        }
      `}</style>
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`
        };
        return <div key={i} className="confetti-piece" style={style}></div>;
      })}
    </div>
  );
};

const GoldConfetti = () => {
  const confettiCount = 150;
  const colors = ['#FFD700', '#FFA500', '#B8860B', '#DAA520', '#F0E68C']; // Tons de dourado

  return (
    <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden flex items-center justify-center">
      <style>{`
        @keyframes fall-gold {
          0% { transform: translateY(-10vh) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotateZ(720deg); opacity: 0; }
        }
        .confetti-gold {
          position: absolute;
          width: 10px;
          height: 20px;
          animation: fall-gold 4s linear forwards;
        }
        @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          top: `-10vh`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: `${Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`
        };
        return <div key={i} className="confetti-gold" style={style}></div>;
      })}
      <div className="z-[301] flex flex-col items-center animate-[pop-in_0.5s_ease-out_forwards]">
        <div className="text-8xl drop-shadow-2xl filter mb-4">👑</div>
        <div className="text-4xl font-black text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] bg-black/60 px-8 py-4 rounded-3xl backdrop-blur-md border-2 border-yellow-500/50">
            PRO ATIVADO!
        </div>
      </div>
    </div>
  );
};

const WelcomeProModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center relative border-4 border-white/20">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="p-8 flex flex-col items-center relative z-10">
        <div className="text-6xl mb-4 animate-bounce filter drop-shadow-lg">👑</div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">VOCÊ É PRO!</h2>
        <p className="text-yellow-100 font-bold text-lg mb-4">A saga continua.</p>
        <p className="text-white text-sm mb-8 leading-relaxed px-2 font-medium">
          Parabéns pela decisão de investir na sua melhor versão. <br/>
          Você desbloqueou o poder total do EvoluFit para dominar a alimentação perfeita.
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-white text-yellow-600 rounded-xl font-black shadow-lg hover:bg-gray-50 transition-transform active:scale-95 uppercase tracking-wider"
        >
          Acessar Meu Plano
        </button>
      </div>
    </div>
  </div>
);

const ClearMealModal = ({ onClose, onConfirm, meal, contextDay, groupMembers }) => {
  const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  const daysForSelection = groupMembers 
    ? groupMembers.map(m => m.dayOfWeek).sort((a, b) => allWeekDays.indexOf(a) - allWeekDays.indexOf(b))
    : (meal.dayOfWeek === 'Todos' ? allWeekDays : [meal.dayOfWeek]);

  const isGroupAction = !!groupMembers || meal.dayOfWeek === 'Todos';

  const [selectedDays, setSelectedDays] = useState(
    contextDay && daysForSelection.includes(contextDay) ? [contextDay] : []
  );

  const toggleDay = (day) => {
    if (!isGroupAction) return;
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleConfirm = () => {
    if (selectedDays.length === 0) return alert('Selecione pelo menos um dia para limpar.');
    onConfirm(selectedDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-amber-50 flex justify-between items-center">
          <h3 className="font-bold text-amber-800 flex items-center gap-2">
            <Eraser size={20} /> Limpar Prato
          </h3>
          <button onClick={onClose}><X size={20} className="text-amber-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Selecione os dias para limpar os alimentos de <strong>"{meal.name}"</strong>:
          </p>
          
          {isGroupAction && (
            <div className="flex gap-2 mb-4">
              <button onClick={() => setSelectedDays(daysForSelection)} className="flex-1 p-2 rounded-lg text-xs font-bold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100">Limpar Todos</button>
              <button onClick={() => setSelectedDays([])} className="flex-1 p-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">Nenhum</button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {daysForSelection.map(day => (
              <button key={day} onClick={() => toggleDay(day)} disabled={!isGroupAction && day !== meal.dayOfWeek} className={`p-2 rounded-lg text-xs font-bold transition-colors ${selectedDays.includes(day) ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${(!isGroupAction && day !== meal.dayOfWeek) ? 'opacity-30 cursor-not-allowed' : ''}`}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold text-sm shadow-md hover:bg-amber-600">Limpar</button>
        </div>
      </div>
    </div>
  );
};

const CloneDayModal = ({ sourceDay, onClose, onConfirm, mealSchedule }) => {
  const [targetType, setTargetType] = useState('weekday'); // 'weekday' | 'date'
  const [targetDay, setTargetDay] = useState('Segunda');
  const [targetDate, setTargetDate] = useState('');
  const [conflictCount, setConflictCount] = useState(null);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleNext = () => {
    const dayToCheck = targetType === 'weekday' ? targetDay : 'Datas Marcadas';
    const dateToCheck = targetType === 'date' ? targetDate : null;

    if (targetType === 'date' && !targetDate) return alert('Selecione uma data.');
    if (targetType === 'weekday' && targetDay === sourceDay) return alert('O dia de destino deve ser diferente da origem.');

    // Verifica se já existem refeições ESPECÍFICAS no destino (ignorando 'Todos')
    const existing = mealSchedule.filter(m => {
        if (m.dayOfWeek !== dayToCheck) return false;
        if (dayToCheck === 'Datas Marcadas') return m.specificDate === dateToCheck;
        return true;
    });

    if (existing.length > 0) {
        setConflictCount(existing.length);
    } else {
        onConfirm(dayToCheck, dateToCheck, 'replace');
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-indigo-50 flex justify-between items-center">
          <h3 className="font-bold text-indigo-800 flex items-center gap-2">
            <Copy size={20} /> Clonar Dia: {sourceDay}
          </h3>
          <button onClick={onClose}><X size={20} className="text-indigo-600" /></button>
        </div>
        
        <div className="p-6">
          {!conflictCount ? (
            <>
              <p className="text-sm text-gray-600 mb-4">Para onde deseja copiar as refeições de <strong>{sourceDay}</strong>?</p>
              
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTargetType('weekday')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${targetType === 'weekday' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-500 border-gray-200'}`}>Dia da Semana</button>
                <button onClick={() => setTargetType('date')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${targetType === 'date' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-500 border-gray-200'}`}>Data Específica</button>
              </div>

              {targetType === 'weekday' ? (
                <div className="grid grid-cols-3 gap-2">
                  {days.map(day => (
                    <button 
                      key={day} 
                      onClick={() => setTargetDay(day)} 
                      disabled={day === sourceDay}
                      className={`p-2 rounded-lg text-xs font-bold transition-colors ${targetDay === day ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} ${day === sourceDay ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ) : (
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full p-3 border rounded-xl bg-gray-50 text-gray-900" />
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Conflito Encontrado</h4>
              <p className="text-sm text-gray-600 mb-6">
                O dia de destino já possui <strong>{conflictCount} refeições</strong> agendadas. O que deseja fazer?
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={() => { onConfirm(targetType === 'weekday' ? targetDay : 'Datas Marcadas', targetDate, 'replace'); onClose(); }} className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600">Substituir (Apagar existentes)</button>
                <button onClick={() => { onConfirm(targetType === 'weekday' ? targetDay : 'Datas Marcadas', targetDate, 'append'); onClose(); }} className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600">Adicionar (Manter existentes)</button>
              </div>
            </div>
          )}
        </div>
        {!conflictCount && <div className="p-4 border-t bg-gray-50 flex justify-end gap-2"><button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button><button onClick={handleNext} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700">Continuar</button></div>}
      </div>
    </div>
  );
};

const ResetScheduleModal = ({ onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue === 'RESETAR';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-bounce">
        <div className="p-4 border-b bg-rose-50 flex justify-between items-center">
          <h3 className="font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle size={20} /> Zona de Perigo
          </h3>
          <button onClick={onClose}><X size={20} className="text-rose-600" /></button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm font-bold">
            Você está prestes a apagar TODAS as refeições criadas e limpar o conteúdo das refeições padrão.
          </p>
          <p className="text-gray-500 text-xs mb-4">
            Esta ação não pode ser desfeita. Para confirmar, digite <strong>RESETAR</strong> no campo abaixo:
          </p>
          
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="Digite RESETAR"
            className="w-full p-3 border-2 border-rose-200 rounded-xl focus:border-rose-500 focus:outline-none font-bold text-rose-600 placeholder:text-rose-200 uppercase"
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm">Cancelar</button>
          <button 
            onClick={onConfirm} 
            disabled={!isMatch}
            className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-all ${isMatch ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Confirmar Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const AchievementModal = ({ badge, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/50 to-transparent pointer-events-none"></div>
      <div className="p-8 flex flex-col items-center">
        <div className="text-6xl mb-4 animate-bounce">{badge.icon}</div>
        <h2 className="text-2xl font-black text-gray-800 mb-1">Nova Conquista!</h2>
        <p className="text-emerald-600 font-bold text-lg mb-2">{badge.name}</p>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {badge.description}
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
        >
          Incrível!
        </button>
      </div>
    </div>
  </div>
);

const LevelUpModal = ({ badge, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center relative border-4 border-yellow-400">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="p-8 flex flex-col items-center relative z-10">
        <h2 className="text-3xl font-black text-yellow-400 mb-2 tracking-widest drop-shadow-md animate-pulse">LEVEL UP!</h2>
        <div className="text-8xl mb-4 animate-bounce filter drop-shadow-lg">{badge.icon}</div>
        <p className="text-white font-bold text-xl mb-1">Você agora é um</p>
        <p className="text-yellow-300 font-black text-2xl mb-4 uppercase tracking-wider">{badge.name}</p>
        <p className="text-indigo-100 text-sm mb-8 leading-relaxed px-4">
          {badge.description}
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-yellow-400 text-indigo-900 rounded-xl font-black shadow-[0_4px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px]"
        >
          CONTINUAR JORNADA
        </button>
      </div>
    </div>
  </div>
);

const IncentiveModal = ({ onClose, title, message }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-bounce text-center">
      <div className="bg-amber-400 p-6 flex justify-center">
        <div className="bg-white p-4 rounded-full shadow-lg">
          <AlertTriangle size={48} className="text-amber-500" />
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-800 mb-2">{title || "Não Desista!"}</h2>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{message}</p>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold shadow-md hover:bg-amber-600 transition-transform active:scale-95"
        >
          Vou recuperar!
        </button>
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('pantry');
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.theme) {
      return localStorage.theme;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      name: '', 
      weight: '', 
      height: '', 
      age: '', 
      targetWeight: '', 
      weeks: '', 
      gender: 'M', 
      activityLevel: 'Sedentário',
      activityDays: 0,
      phone: '',
      waterGoal: '2500',
      alarmSound: 'sine',
      isSetupDone: false,
      planStartDate: new Date().toISOString(),
      ...parsed
    };
  });

  const [customFoods, setCustomFoods] = useState(() => {
    const saved = localStorage.getItem('customFoods');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  });

  const [pantryItems, setPantryItems] = useState(() => {
    const saved = localStorage.getItem('pantry');
    return saved ? JSON.parse(saved) : ['1', '2', '3', '4', '5'];
  });
  
  const [currentPlate, setCurrentPlate] = useState([]);
  
  const [mealSchedule, setMealSchedule] = useState(() => {
    const saved = localStorage.getItem('mealSchedule');
    if (saved) return JSON.parse(saved);
    return DEFAULT_MEAL_SCHEDULE;
  });

  const [isListening, setIsListening] = useState(false);
  const [scheduleWarnings, setScheduleWarnings] = useState([]);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showManual, setShowManual] = useState(false);
  const [highlightedRect, setHighlightedRect] = useState(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [deleteContextDay, setDeleteContextDay] = useState(null);
  const [mealToDuplicate, setMealToDuplicate] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProConfetti, setShowProConfetti] = useState(false);
  const [showWelcomePro, setShowWelcomePro] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [mealToClear, setMealToClear] = useState(null);
  const [clearContextDay, setClearContextDay] = useState(null);
  const [initialPlateDays, setInitialPlateDays] = useState([]);
  const [groupToClear, setGroupToClear] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoodAddedModal, setShowFoodAddedModal] = useState(false);
  const [voiceAddedFoodId, setVoiceAddedFoodId] = useState(null);
  const [newlyAddedFoodName, setNewlyAddedFoodName] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [shoppingListCheckedItems, setShoppingListCheckedItems] = useState({});
  const [shoppingListHiddenItems, setShoppingListHiddenItems] = useState({});
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [editingMealInfo, setEditingMealInfo] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showCalorieAlert, setShowCalorieAlert] = useState(false);
  const [showGoalReached, setShowGoalReached] = useState(false);
  const [newUnlockedBadge, setNewUnlockedBadge] = useState(null);
  const [newLevelUpBadge, setNewLevelUpBadge] = useState(null);
  const [showHeartExplosion, setShowHeartExplosion] = useState(false);
  const [showClapping, setShowClapping] = useState(false);
  const [clappingMessage, setClappingMessage] = useState('');
  const [showWaterGoalModal, setShowWaterGoalModal] = useState(false);
  const [hasCelebratedWaterToday, setHasCelebratedWaterToday] = useState(false);
  const [showWaterLostModal, setShowWaterLostModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // State for educational modal
  const [showEducationalModal, setShowEducationalModal] = useState(false);
  const [currentEducationalContent, setCurrentEducationalContent] = useState(null);

  useEffect(() => {
    // Listener de Navegação para o Educador Nutricional (Diretrizes 2026)
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    // Se o tour estiver ativo, ou se o tour nunca foi concluído, não mostre os modais educativos.
    if (showTour || !hasSeenTour) return;

    const content = educationalData[activeTab];
    if (content) {
      const hasSeen = localStorage.getItem(content.storageKey);
      if (!hasSeen) {
        setCurrentEducationalContent(content);
        setShowEducationalModal(true);
      }
    }
  }, [activeTab, showTour]);

  const [excessCalories, setExcessCalories] = useState(0);
  const [movedMealId, setMovedMealId] = useState(null);
  const [isTrialActive, setIsTrialActive] = useState(true);
  const [accessStatus, setAccessStatus] = useState('trial'); // 'trial', 'premium', 'admin'
  const [isRealAdmin, setIsRealAdmin] = useState(false); // Controle para exibir ferramentas de debug
  const CURRENT_NEWS_VERSION = 1; // Increment this number to show the modal again to users
  const [addMealContext, setAddMealContext] = useState(null);
  const [exportMode, setExportMode] = useState('weekly');
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [cloneSourceDay, setCloneSourceDay] = useState(null);
  
  // Estado para controle de água (reseta diariamente)
  // Armazena o total em ML
  const [waterIntake, setWaterIntake] = useState(() => {
    const saved = localStorage.getItem('waterIntake');
    const today = new Date().toLocaleDateString('pt-BR');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) {
          // Migração: se o valor for pequeno (< 50), assume que era contagem de copos e converte para ml
          return parsed.count < 50 ? parsed.count * 250 : parsed.count;
        }
      } catch (e) {
        console.error("Erro ao carregar dados de água:", e);
      }
    }
    return 0;
  });

  // --- Gamificação: Estado de Streaks e Conquistas ---
  const [gamification, setGamification] = useState(() => {
    const saved = localStorage.getItem('gamification');
    return saved ? JSON.parse(saved) : {
      currentStreak: 0,
      maxStreak: 0,
      lastLogDate: null,
      achievements: [],
      hearts: 0,
      hydrationScore: 0 // 0 a 3 (Barra de hidratação)
    };
  });

  useEffect(() => {
    localStorage.setItem('gamification', JSON.stringify(gamification));
  }, [gamification]);

  // Verifica se o streak foi quebrado ao carregar o app
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setGamification(prev => {
      // Se o último log não foi hoje nem ontem, e o streak é maior que 0, quebrou.
      if (prev.lastLogDate && prev.lastLogDate !== today && prev.lastLogDate !== yesterdayStr && prev.currentStreak > 0) {
        return { ...prev, currentStreak: 0 };
      }
      return prev;
    });
  }, []);

  // --- Sistema de Conquistas (Badges) ---
  useEffect(() => {
    const currentAchievements = gamification.achievements || [];
    const newAchievements = [];
    
    // Regras de Desbloqueio
    if (gamification.currentStreak >= 1 && !currentAchievements.includes('first_step')) newAchievements.push('first_step');
    if (gamification.currentStreak >= 3 && !currentAchievements.includes('streak_3')) newAchievements.push('streak_3');
    if (gamification.currentStreak >= 7 && !currentAchievements.includes('streak_7')) newAchievements.push('streak_7');
    
    // Níveis (Baseados no Recorde/MaxStreak para não punir perda de combo acidental)
    if (gamification.maxStreak >= 30 && !currentAchievements.includes('streak_30')) newAchievements.push('streak_30');
    if (gamification.maxStreak >= 60 && !currentAchievements.includes('streak_60')) newAchievements.push('streak_60');
    if (gamification.maxStreak >= 90 && !currentAchievements.includes('streak_90')) newAchievements.push('streak_90');
    if (gamification.maxStreak >= 120 && !currentAchievements.includes('streak_120')) newAchievements.push('streak_120');
    
    // Regras de Corações (Novas)
    const hearts = gamification.hearts || 0;
    if (hearts >= 10 && !currentAchievements.includes('heart_10')) newAchievements.push('heart_10');
    if (hearts >= 50 && !currentAchievements.includes('heart_50')) newAchievements.push('heart_50');
    if (hearts >= 100 && !currentAchievements.includes('heart_100')) newAchievements.push('heart_100');
    if (hearts >= 120 && !currentAchievements.includes('heart_120')) newAchievements.push('heart_120');
    if (hearts >= 150 && !currentAchievements.includes('heart_150')) newAchievements.push('heart_150');

    if (newAchievements.length > 0) {
        setGamification(prev => ({
            ...prev,
            achievements: [...(prev.achievements || []), ...newAchievements]
        }));
        
        // Verifica se alguma das novas conquistas é um Level Up
        const levelBadgeIds = ['streak_30', 'streak_60', 'streak_90', 'streak_120'];
        const levelBadgeId = newAchievements.find(id => levelBadgeIds.includes(id));

        if (levelBadgeId) {
            const badgeData = BADGES_DATA.find(b => b.id === levelBadgeId);
            setNewLevelUpBadge(badgeData);
            playLevelUpSound();
            triggerConfetti();
        } else {
            // Se não for level up, mostra conquista normal
            const badgeData = BADGES_DATA.find(b => b.id === newAchievements[newAchievements.length - 1]);
            if (badgeData) {
                setNewUnlockedBadge(badgeData);
                triggerConfetti();
            }
        }
    }
  }, [gamification.currentStreak, waterIntake, userProfile.waterGoal]);

  // Estado para histórico de água (persistido)
  const [waterHistory, setWaterHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('waterHistory');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('waterIntake', JSON.stringify({
      date: new Date().toLocaleDateString('pt-BR'),
      count: waterIntake
    }));
  }, [waterIntake]);

  // Atualiza o histórico sempre que o consumo de hoje mudar
  useEffect(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    setWaterHistory(prev => {
      const newHistory = { ...prev, [today]: waterIntake };
      localStorage.setItem('waterHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [waterIntake]);

  // --- Lógica de Água: Virada do Dia e Score ---
  useEffect(() => {
    const checkDayChange = () => {
      const today = new Date().toLocaleDateString('pt-BR');
      const saved = localStorage.getItem('waterIntake');
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.date !== today) {
            // Virada de dia detectada! Processar Score de Hidratação.
            const goal = parseInt(userProfile.waterGoal || 2500);
            const wasGoalMet = parsed.count >= goal;
            
            // Calcula dias perdidos (se o usuário não abriu o app por alguns dias)
            const lastDate = new Date(parsed.date.split('/').reverse().join('-'));
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            // diffDays = 1 (ontem), 2 (anteontem), etc.

            setGamification(prev => {
                let newScore = prev.hydrationScore || 0;
                let newAchievements = [...(prev.achievements || [])];
                let badgeLost = false;

                // 1. Processa o dia registrado (Ontem)
                if (wasGoalMet) {
                    newScore = Math.min(3, newScore + 1);
                } else {
                    newScore = Math.max(0, newScore - 1);
                }

                // 2. Processa dias não registrados (Gaps) - penaliza score
                if (diffDays > 1) {
                    const missedDays = diffDays - 1;
                    newScore = Math.max(0, newScore - missedDays);
                }

                // 3. Regra do Badge
                const hasBadge = newAchievements.includes('water_master');
                
                if (newScore === 3 && !hasBadge) {
                    newAchievements.push('water_master');
                    setNewUnlockedBadge(BADGES_DATA.find(b => b.id === 'water_master'));
                } else if (newScore === 0 && hasBadge) {
                    newAchievements = newAchievements.filter(id => id !== 'water_master');
                    badgeLost = true;
                }

                if (badgeLost) {
                    setShowWaterLostModal(true);
                }

                return {
                    ...prev,
                    hydrationScore: newScore,
                    achievements: newAchievements
                };
            });

            // Reseta para hoje
            setWaterIntake(0);
            setHasCelebratedWaterToday(false);
          }
        } catch (e) {
          console.error("Erro ao processar virada do dia da água", e);
        }
      }
    };

    // Executa ao montar e em intervalos
    checkDayChange();
    const interval = setInterval(checkDayChange, 60000); // Checa a cada minuto
    window.addEventListener('focus', checkDayChange); // Checa ao focar a janela (ex: voltar do background no celular)
    return () => { clearInterval(interval); window.removeEventListener('focus', checkDayChange); };
  }, [userProfile.waterGoal]);

  // Monitora meta de água atingida HOJE para celebrar
  useEffect(() => {
    const goal = parseInt(userProfile.waterGoal || 2500);
    if (waterIntake >= goal && waterIntake > 0 && !hasCelebratedWaterToday) {
        setHasCelebratedWaterToday(true);
        setShowWaterGoalModal(true);
        triggerConfetti();
    }
  }, [waterIntake, userProfile.waterGoal, hasCelebratedWaterToday]);

  // --- Lógica de Renovação Semanal Automática ---
  useEffect(() => {
    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const todayName = daysMap[today.getDay()];

    setMealSchedule(prevSchedule => {
      let hasChanges = false;
      const newSchedule = prevSchedule.map(meal => {
        if (!meal.isDone) return meal;

        let shouldReset = false;

        // Caso 1: Refeição de dia específico (ex: Segunda)
        // Se hoje é Segunda, mas a refeição foi marcada como feita em uma data diferente de hoje (ex: Segunda passada), reseta.
        if (meal.dayOfWeek === todayName) {
           if (meal.lastDoneDate && meal.lastDoneDate !== todayDateStr) {
             shouldReset = true;
           }
        }
        
        // Caso 2: Refeição 'Todos' (Diária)
        // Se foi feita, mas não hoje, reseta para estar disponível hoje.
        if (meal.dayOfWeek === 'Todos') {
           if (meal.lastDoneDate && meal.lastDoneDate !== todayDateStr) {
             shouldReset = true;
           }
        }

        if (shouldReset) {
          hasChanges = true;
          return { ...meal, isDone: false, lastDoneDate: null };
        }
        return meal;
      });

      return hasChanges ? newSchedule : prevSchedule;
    });
  }, []);

  // --- Lógica de Controle de Acesso (Trial e Admin) ---
  useEffect(() => {
    const checkAccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('access_token');
      
      // Definição dos Tokens (Ofuscados em Base64)
      // IMPORTANTE: Estes tokens devem bater com os configurados na URL de redirecionamento da Kiwify
      // Weekly: EVOLUFIT_WEEKLY_2026 -> RVZPTFVGSVRfV0VFS0xZXzIwMjY=
      // Monthly: EVOLUFIT_MONTHLY_2026 -> RVZPTFVGSVRfTU9OVEhMWV8yMDI2
      // Yearly: EVOLUFIT_YEARLY_2026 -> RVZPTFVGSVRfWUVBUkxZXzIwMjY=
      const PLAN_TOKENS = {
        'RVZPTFVGSVRfV0VFS0xZXzIwMjY=': { days: 7, type: 'premium', plan: 'weekly' },
        'RVZPTFVGSVRfTU9OVEhMWV8yMDI2': { days: 35, type: 'premium', plan: 'monthly' }, // Renovação com 35 dias (folga)
        'RVZPTFVGSVRfWUVBUkxZXzIwMjY=': { days: 365, type: 'premium', plan: 'yearly' },
        'TEST_TOKEN_PREMIUM': { days: 30, type: 'premium', plan: 'monthly' } // Token de teste
      };

      // 0. Backdoor de Teste Premium (Para simular usuário pagante sem token real)
      if (urlParams.get('test_premium') === 'true') {
        const fakeExpiry = new Date();
        fakeExpiry.setDate(fakeExpiry.getDate() + 30);
        const accessData = {
          type: 'premium',
          plan: 'monthly',
          expiryDate: fakeExpiry.toISOString(),
          token: 'TEST_TOKEN_PREMIUM'
        };
        localStorage.setItem('accessInfo', JSON.stringify(accessData));
        
        // Ativa a experiência visual completa (Confetes + Modal) sem recarregar
        setIsTrialActive(true);
        setAccessStatus('premium');
        window.history.replaceState({}, document.title, window.location.pathname); // Limpa URL
        setShowWelcome(false);
        setShowProConfetti(true);
        setTimeout(() => setShowProConfetti(false), 5000);
        setShowWelcomePro(true);
        return;
      }

      // 1. Prioridade: Validação via URL (Novo Acesso Pós-Pagamento)
      if (tokenParam) {
        const encodedToken = btoa(tokenParam); // Codifica o que veio na URL para comparar
        const planInfo = PLAN_TOKENS[encodedToken];

        if (planInfo) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + planInfo.days);
          
          const accessData = {
            type: 'premium',
            plan: planInfo.plan,
            expiryDate: expiryDate.toISOString(),
            token: encodedToken // Salva o hash para validação futura
          };

          localStorage.setItem('accessInfo', JSON.stringify(accessData));
          setIsTrialActive(true);
          setAccessStatus('premium');
          window.history.replaceState({}, document.title, window.location.pathname); // Limpa URL
          setShowWelcome(false); // Garante que a tela de vendas/trial NÃO apareça
          setShowProConfetti(true);
          setTimeout(() => setShowProConfetti(false), 5000);
          setShowWelcomePro(true); // Exibe o modal de boas-vindas PRO
          return;
        } else {
          alert('Token de acesso inválido ou expirado.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      // 2. Prioridade: Verificação de Persistência (Admin ou Premium)
      const accessInfo = JSON.parse(localStorage.getItem('accessInfo'));

      if (accessInfo) {
        if (accessInfo.type === 'admin') {
          setIsTrialActive(true);
          setAccessStatus('admin');
          setIsRealAdmin(true);
          return;
        }
        
        if (accessInfo.type === 'premium') {
          const now = new Date();
          const expiry = new Date(accessInfo.expiryDate);
          const isValidToken = PLAN_TOKENS[accessInfo.token];

          if (isValidToken && now < expiry) {
            setIsTrialActive(true);
            setAccessStatus('premium');
            return;
          } else {
            // Expirou ou token inválido
            localStorage.removeItem('accessInfo');
          }
        }
      }

      // 3. Prioridade: Checa por acesso de admin na URL (Legado)
      if (urlParams.get('admin') === 'true') {
        localStorage.setItem('accessInfo', JSON.stringify({ type: 'admin' }));
        setAccessStatus('admin');
        setIsRealAdmin(true);
        setIsTrialActive(true); // Admin sempre tem acesso
        // Limpa a URL para não ficar visível
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // 4. Prioridade: Trial Gratuito (72h)
      // Alterado para 'evolufit_trial_start_v1' para garantir que a WelcomeScreen apareça para todos nesta versão
      const firstAccess = localStorage.getItem('evolufit_trial_start_v1');
      if (!firstAccess) {
        // Não inicia o trial automaticamente. Mostra a tela de vendas/boas-vindas primeiro.
        setShowWelcome(true);
        setIsTrialActive(false); // Fica falso até aceitar o desafio
      } else {
        const trialEndTime = parseInt(firstAccess, 10) + (72 * 60 * 60 * 1000); // 72 horas
        setIsTrialActive(new Date().getTime() < trialEndTime);
      }
    };

    checkAccess();
  }, []);

  // Função para alternar modos de visualização (Apenas para Admin Real)
  const handleDebugToggle = () => {
    if (!isRealAdmin) return;
    
    setAccessStatus(prev => {
      if (prev === 'admin') {
        alert('👁️ Modo Visualização: PREMIUM');
        return 'premium';
      } else if (prev === 'premium') {
        alert('👁️ Modo Visualização: TRIAL');
        return 'trial';
      } else {
        alert('🛡️ Modo: ADMIN (Restaurado)');
        return 'admin';
      }
    });
  };

  // --- PWA Logic ---
  useEffect(() => {
    // Na inicialização do app, verifica e popula o IndexedDB se necessário.
    populateDB();
  }, []);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  };

  // Check for updates news
  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('whatsNewVersion');
    if (!lastSeenVersion || parseInt(lastSeenVersion, 10) < CURRENT_NEWS_VERSION) {
      const timer = setTimeout(() => setShowWhatsNew(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWhatsNew = () => {
    setShowWhatsNew(false);
    localStorage.setItem('whatsNewVersion', CURRENT_NEWS_VERSION.toString());
  };

  // Efeito para limpar o destaque do item adicionado por voz após um tempo
  useEffect(() => {
    if (voiceAddedFoodId) {
      const timer = setTimeout(() => {
        setVoiceAddedFoodId(null);
      }, 10000); // Destaque dura 10 segundos
      return () => clearTimeout(timer);
    }
  }, [voiceAddedFoodId]);

  const [isAlerting, setIsAlerting] = useState(false);

const AlertAnimationOverlay = () => (
  <div className="fixed inset-0 max-w-md mx-auto pointer-events-none z-[200]">
    <style>{`
      @keyframes pulse-border-alert {
        0% { box-shadow: inset 0 0 0 0px rgba(34, 197, 94, 0); }
        20% { box-shadow: inset 0 0 0 10px rgba(34, 197, 94, 0.8); }
        100% { box-shadow: inset 0 0 0 0px rgba(34, 197, 94, 0); }
      }
      .animate-pulse-visual-alert {
        /* A animação dura 2s e se repete 2 vezes, totalizando 4s */
        animation: pulse-border-alert 2s ease-out 2;
        border-radius: 1.5rem; /* Para combinar com o arredondamento do layout se houver */
      }
    `}</style>
    <div className="w-full h-full animate-pulse-visual-alert"></div>
  </div>
);


  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('pantry', JSON.stringify(pantryItems));
    localStorage.setItem('customFoods', JSON.stringify(customFoods));
    localStorage.setItem('mealSchedule', JSON.stringify(mealSchedule));
  }, [userProfile, pantryItems, customFoods, mealSchedule]);

  // Solicita permissão para notificações na primeira vez que o app é aberto
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (userProfile.isSetupDone) {
      // Substitui a entrada atual no histórico para impedir o retorno à tela de configuração
      window.history.replaceState(null, '', window.location.pathname);

      const hasSeen = localStorage.getItem('hasSeenTour');
      if (!hasSeen) setShowTour(true);
    }
  }, [userProfile.isSetupDone]);

  const handleTabChange = (newTab) => {
    // Se o usuário estava editando uma refeição e saiu da tela de Prato, cancelamos a edição.
    if (activeTab === 'plate' && newTab !== 'plate' && editingMealInfo) {
      setEditingMealInfo(null);
      setCurrentPlate([]); // Limpa o prato para evitar confusão
      setInitialPlateDays([]); // Reseta os dias pré-selecionados
    }
    setActiveTab(newTab);
  };

  useEffect(() => {
    if (showTour) {
       if (tourStep === 1) setActiveTab('pantry');
       if (tourStep === 2 || tourStep === 3) setActiveTab('plate');
       if (tourStep >= 4) setActiveTab('schedule');
    }
  }, [tourStep, showTour]);

  const handleTourNext = () => tourStep < 6 ? setTourStep(p => p + 1) : (setShowTour(false), localStorage.setItem('hasSeenTour', 'true'), setActiveTab('pantry'));
  const handleTourBack = () => tourStep > 0 && setTourStep(p => p - 1);
  const handleTourSkip = () => (setShowTour(false), localStorage.setItem('hasSeenTour', 'true'), setActiveTab('pantry'));

  // Spotlight effect logic
  useEffect(() => {
    if (!showTour) {
      setHighlightedRect(null);
      return;
    }

    const tourSelectors = {
      1: '[data-tour-id="pantry-search"]',
      2: '[data-tour-id="plate-item-example"]',
      3: '[data-tour-id="plate-scheduling"]',
      5: '[data-tour-id="schedule-add-meal"]',
    };

    const selector = tourSelectors[tourStep];
    if (!selector) {
      setHighlightedRect(null);
      return;
    }

    const timer = setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Rola até o elemento
        setHighlightedRect(element.getBoundingClientRect());
      } else {
        setHighlightedRect(null);
      }
    }, 150); // Delay to allow tab transitions

    return () => clearTimeout(timer);
  }, [tourStep, showTour, activeTab]);

  const handleRestartTour = () => {
    setTourStep(0);
    setShowTour(true);
    localStorage.removeItem('hasSeenTour');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Cálculo da Meta Diária (Duplicado do BrainScreen para uso nos alertas globais)
  const getDailyGoal = () => {
    const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = userProfile;    
    if (!weight || !height || !age || !gender || !activityLevel || !targetWeight || !weeks) return 0;
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
    
    // Cálculo inteligente de TDEE: Base Sedentário (1.2) + (Fator Intensidade * Dias)
    const intensityFactors = {
      'Sedentário': 0,
      'Leve': 0.035,    // Ex: 3 dias * 0.035 = +0.105 (Total ~1.3)
      'Moderada': 0.05,
      'Pesada': 0.075,
      'Atleta': 0.1
    };
    const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
    const tdee = bmr * (1.2 + activityAddon);

    const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
    return Math.max(1200, tdee - dailyAdjustment);
  };

  // Calcula TMB para usar como piso de segurança
  const getTMB = () => {
    const { weight, height, age, gender } = userProfile;
    if (!weight || !height || !age || !gender) return 1200; // Fallback de segurança
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'M' ? 5 : -161;
    return bmr;
  };

  // Calcula calorias REALMENTE consumidas (refeições marcadas como 'isDone')
  const getConsumedCalories = () => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const today = daysMap[new Date().getDay()];
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    
    let total = 0;
    mealSchedule.forEach(meal => {
      // Considera apenas refeições de hoje que estão FEITAS
      if ((meal.dayOfWeek === today || meal.dayOfWeek === 'Todos') && meal.isDone) {
        meal.plate.forEach(item => {
          const food = allFoods.find(f => f.id === item.foodId);
          if (food) {
            const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
            total += (food.calories / 100) * weight;
          }
        });
      }
    });
    return total;
  };

  const handleMealDone = (meal) => {
    // Calcula calorias desta refeição específica
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    let mealCalories = 0;
    meal.plate.forEach(item => {
      const food = allFoods.find(f => f.id === item.foodId);
      if (food) {
        const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
        mealCalories += (food.calories / 100) * weight;
      }
    });

    // Validação do Dia Atual: Se não for hoje, não dispara confetes nem alertas
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const todayName = daysMap[new Date().getDay()];
    const todayDate = new Date().toISOString().split('T')[0];
    
    const isToday = meal.dayOfWeek === 'Todos' || meal.dayOfWeek === todayName || (meal.dayOfWeek === 'Datas Marcadas' && meal.specificDate === todayDate);

    if (!isToday) return;

    // --- Lógica de Gamificação (Atualizar Streak) ---
    setGamification(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Se já registrou hoje, não muda o streak
      if (prev.lastLogDate === todayStr) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.currentStreak;
      // Se registrou ontem, incrementa. Se não (e não é hoje), reseta para 1.
      if (prev.lastLogDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        maxStreak: Math.max(newStreak, prev.maxStreak),
        lastLogDate: todayStr
      };
    });

    const currentConsumed = getConsumedCalories();
    const totalAfterMeal = currentConsumed + mealCalories;
    const dailyGoal = getDailyGoal();
    const tmb = getTMB();
    const isLosingWeight = userProfile.targetWeight < userProfile.weight;

    const allMealsForToday = mealSchedule.filter(m => (m.dayOfWeek === todayName || m.dayOfWeek === 'Todos') && m.plate.length > 0);
    const doneMealsCount = mealSchedule.filter(m => m.isDone && (m.dayOfWeek === todayName || m.dayOfWeek === 'Todos')).length;
    // Adiciona 1 pois a refeição atual está sendo marcada como feita neste momento
    const isLastMeal = doneMealsCount + 1 >= allMealsForToday.length;

    let shouldCelebrate = false;
    let shouldAlertExcess = false;

    // Lógica de Corações (Escolhas Sábias)
    // Regra: Ganha coração se (Saudáveis > Não Saudáveis)
    const healthyCategories = ['Vegetais', 'Frutas', 'Proteínas', 'Leguminosas', 'Gorduras'];
    const unhealthyCategories = ['Industrializados', 'Doces', 'Carboidratos']; // Carboidratos incluídos como "pesados" para o balanço
    
    let healthyCount = 0;
    let unhealthyCount = 0;
    
    meal.plate.forEach(item => {
        const food = allFoods.find(f => f.id === item.foodId);
        if (food) {
            if (healthyCategories.includes(food.category)) healthyCount++;
            if (unhealthyCategories.includes(food.category)) unhealthyCount++;
        }
    });
    
    const isWiseChoice = healthyCount > unhealthyCount;

    if (isLosingWeight) {
      // CENÁRIO 1: PERDA DE PESO
      const toleranceLimit = dailyGoal * 1.05; // 5% de tolerância

      if (totalAfterMeal > toleranceLimit) {
        // Excesso Negativo (> 5%): Aviso de excesso, sem confete
        shouldAlertExcess = true;
      } else if (totalAfterMeal >= dailyGoal && totalAfterMeal <= toleranceLimit) {
        // Margem de Tolerância (entre 100% e 105%): Confete, sem aviso
        shouldCelebrate = true;
      } else if (totalAfterMeal > tmb && isLastMeal) {
        // Regra da TMB + Última Refeição: Confete
        shouldCelebrate = true; 
      }
    } else {
      // CENÁRIO 2: GANHO DE PESO (HIPERTROFIA)
      // Sem avisos negativos de excesso.
      if (totalAfterMeal >= dailyGoal) {
        shouldCelebrate = true;
      }
    }

    if (shouldAlertExcess) {
      setExcessCalories(totalAfterMeal - dailyGoal);
      setShowCalorieAlert(true);
      return; // Não celebra se tiver alerta de excesso
    }

    // Ganha coração se fez escolhas sábias (Agora independente da meta diária)
    if (isWiseChoice) {
        setGamification(prev => ({ ...prev, hearts: (prev.hearts || 0) + 1 }));
        setShowHeartExplosion(true);
        setTimeout(() => setShowHeartExplosion(false), 3000);
    }

    // Feedback de Palminhas (Sempre que consumir)
    setClappingMessage(isWiseChoice ? "Excelente escolha nutricional!" : "Refeição registrada!");
    setShowClapping(true);
    setTimeout(() => setShowClapping(false), 3000);

    if (shouldCelebrate) {
        setShowGoalReached(true);
    }

    // Confete removido daqui pois agora temos HeartExplosion e Clapping específicos
  };

  // Cálculo de Calorias de Hoje
  const getTodayCalories = () => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const today = daysMap[new Date().getDay()];
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    
    let total = 0;
    mealSchedule.forEach(meal => {
      if (meal.dayOfWeek === today || meal.dayOfWeek === 'Todos') {
        meal.plate.forEach(item => {
          const food = allFoods.find(f => f.id === item.foodId);
          if (food) {
            const weight = getFoodUnitWeight(food, item.unit) * item.quantity;
            total += (food.calories / 100) * weight;
          }
        });
      }
    });
    return total;
  };

  // Atualiza o Badge do App (PWA) com o número de refeições do dia
  useEffect(() => {
    if ('setAppBadge' in navigator) {
      // Lógica de Badge: Indica mensagens do sistema (ex: Alertas pendentes ou excesso)
      let badgeCount = 0;
      const dailyGoal = getDailyGoal();
      const currentCalories = getTodayCalories();
      const isLosingWeight = userProfile.targetWeight < userProfile.weight;
      
      // Se ultrapassou a meta (e for perda de peso), badge = 1 (Aviso crítico)
      if (isLosingWeight && currentCalories > dailyGoal * 1.05) {
        badgeCount = 1;
      }
      
      if (badgeCount > 0) {
        navigator.setAppBadge(badgeCount).catch(e => console.error("Erro ao definir badge:", e));
      } else {
        navigator.clearAppBadge().catch(e => console.error("Erro ao limpar badge:", e));
      }
    }
  }, [mealSchedule, userProfile]);

  // Sistema de Alerta em Tempo Real
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHMT = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
      const today = daysMap[now.getDay()];

      // Alerta de Limite de Calorias
      const dailyGoal = getDailyGoal();
      const currentCalories = getTodayCalories();
      const isLosingWeight = userProfile.targetWeight < userProfile.weight;

      // Verifica se passou do limite e se ainda não avisou hoje (lógica simplificada para demo)
      // Só alerta excesso se o objetivo for PERDA DE PESO e passar da tolerância de 5%
      if (isLosingWeight && currentCalories > dailyGoal * 1.05 && !window.hasAlertedCalories) {
        // Alerta visual apenas (Badge e Modal já cuidam disso, aqui removemos o alert intrusivo e a voz)
        window.hasAlertedCalories = true; // Flag temporária na janela
      }
      
      setMealSchedule(prev => prev.map(meal => {
        const isToday = meal.dayOfWeek === today || meal.dayOfWeek === 'Todos';
        // Apenas dispara o alerta se a refeição tiver itens no prato
        if (isToday && meal.time === currentHMT && !meal.alertTriggered && meal.plate.length > 0) {
          triggerAlert(meal.name, meal.plate);
          return { ...meal, alertTriggered: true };
        }
        if (meal.time !== currentHMT) return { ...meal, alertTriggered: false };
        return meal;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, [mealSchedule, userProfile.alarmSound, userProfile]);

  const playLimitSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      // Som de alerta (onda dente de serra para ser mais "áspero")
      osc.type = 'sawtooth'; 
      gain.gain.setValueAtTime(0, now);

      // Padrão descendente rápido (Alerta)
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.error("Erro ao tocar som de limite", e);
    }
  };

  const playMealSound = (mealName) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      const name = mealName.toLowerCase();

      // Som suave tipo flauta/notificação
      osc.type = userProfile.alarmSound || 'sine';
      gain.gain.setValueAtTime(0, now);

      const playNote = (freq, startTime, duration) => {
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01); // Fade in suave
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.linearRampToValueAtTime(0, startTime + duration); // Fade out suave
      };

      // Sequência de 3 notas ascendentes
      playNote(880, now, 0.15); // A5
      playNote(1046.50, now + 0.2, 0.15); // C6
      playNote(1318.51, now + 0.4, 0.2); // E6

      osc.start(now);
      osc.stop(now + 0.7);

    } catch (e) {
      console.error("Erro ao tocar som", e);
    }
  };

  const playReorderSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.type = 'triangle'; // Onda triangular para um som mais "áspero"
      gain.gain.setValueAtTime(0.05, now);
      osc.frequency.setValueAtTime(150, now); // Frequência mais grave
      osc.frequency.linearRampToValueAtTime(100, now + 0.4); // Descida mais lenta
      gain.gain.linearRampToValueAtTime(0, now + 0.4); // Fade out mais longo

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) { console.error("Erro ao tocar som de reordenação", e); }
  };

  const playLevelUpSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; // Onda senoidal pura para um som "mágico"
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      // Arpejo de Level Up (C Maior ascendente)
      playTone(523.25, now, 0.2);       // C5
      playTone(659.25, now + 0.1, 0.2); // E5
      playTone(783.99, now + 0.2, 0.2); // G5
      playTone(1046.50, now + 0.3, 0.6);// C6 (Nota final mais longa)
      
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const triggerAlert = (mealName, plate) => {
    // 1. Ativa a animação visual na tela
    setIsAlerting(true);
    setTimeout(() => {
      setIsAlerting(false);
    }, 4000); // Desliga a animação após 4 segundos

    // 2. Vibrar (se suportado) para feedback tátil
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]); // Vibração tripla para chamar atenção
    }

    // 3. Tocar som personalizado em loop (3 vezes)
    let repeat = 0;
    const soundInterval = setInterval(() => {
      playMealSound(mealName);
      repeat++;
      if (repeat >= 3) {
        clearInterval(soundInterval);
      }
    }, 1200); // Intervalo de 1.2s entre as repetições

  // 4. Notificação Visual Nativa (fora do app)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification('⏰ Lembrete EvoluFit', {
      body: `Está na hora do seu ${mealName}!`,
      icon: '/logo192.png', // Ícone padrão de PWAs.
      vibrate: [200, 100, 200], // Vibração junto com a notificação
    });
  } else {
    // Fallback para o alerta se as notificações não forem permitidas
    setTimeout(() => alert(`⏰ Lembrete EvoluFit: Hora do ${mealName}!`), 500);
  }
  };

  const allAvailableFoods = [...FOOD_DATABASE, ...customFoods];

  const addCustomFood = (name) => {
    const newId = `custom-${Date.now()}`;
    const measures = inferFoodMeasures(name);
    
    // Tenta inferir nutrientes de um alimento base. Se não conseguir, usa um padrão.
    const inferred = inferNutrients(name);
    const baseNutrients = inferred || {
      calories: 120, protein: 4, carbs: 20, fat: 3, fiber: 1,
      emoji: '🍽️', category: 'Meus Alimentos'
    };

    const newFood = {
      id: newId, 
      name, 
      ...baseNutrients, // Usa os nutrientes, emoji e categoria inferidos ou padrão
      measures
    };
    
    setCustomFoods(prev => [...prev, newFood]);
    setPantryItems(prev => Array.from(new Set([...prev, newId])));
    setNewlyAddedFoodName(name);
    setShowFoodAddedModal(true);
    return newId;
  };

  // Helper para disparar mensagens educativas (evita repetição de código)
  const triggerEducationalMessage = (key) => {
    // Bloqueio de segurança: Não exibir se o tour estiver rodando ou não finalizado
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (showTour || !hasSeenTour) return;

    const content = educationalData[key];
    if (content) {
      const hasSeen = localStorage.getItem(content.storageKey);
      if (!hasSeen) {
        setCurrentEducationalContent(content);
        setShowEducationalModal(true);
      }
    }
  };

  // --- Lógica Educacional Interativa (Diretrizes 2026) ---
  const handleFoodInteraction = (foodId) => {
    const food = allAvailableFoods.find(f => f.id === foodId);
    if (!food) return;

    let contentKey = null;

    // Critério 1: Proteína Densa (Categoria ou > 10g de proteína)
    if (food.category === 'Proteínas' || (food.protein && food.protein >= 10)) {
      contentKey = 'interaction_protein';
    } 
    // Critério 2: Alimentos Naturais/Integrais
    else if (['Frutas', 'Vegetais', 'Leguminosas'].includes(food.category)) {
      contentKey = 'interaction_natural';
    }

    if (contentKey) {
      triggerEducationalMessage(contentKey);
    }
  };

  // Lógica de Interação no Prato (Volume Inteligente)
  const handlePlateUpdate = (id, updates) => {
    setCurrentPlate(prev => {
      const itemIndex = prev.findIndex(x => x.foodId === id);
      if (itemIndex === -1) return prev;
      
      const oldItem = prev[itemIndex];
      // Verifica se houve aumento de quantidade em alimentos estratégicos
      if (updates.quantity && updates.quantity > oldItem.quantity) {
        const food = allAvailableFoods.find(f => f.id === id);
        if (food && ['Vegetais', 'Frutas', 'Leguminosas', 'Proteínas'].includes(food.category)) {
          triggerEducationalMessage('interaction_volume');
        }
      }
      
      const newPlate = [...prev];
      newPlate[itemIndex] = { ...oldItem, ...updates };
      return newPlate;
    });
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      // Ação principal: atualiza o termo de busca, que vai filtrar a lista na PantryScreen
      setSearchTerm(transcript);
      // Garante que o usuário veja a busca, mudando para a aba da dispensa
      setActiveTab('pantry');
    };
    recognition.start();
  };

  const handleAddMeal = (daysInput, time, specificDate, repeatCount = 1) => {
    const days = Array.isArray(daysInput) ? daysInput : [daysInput];
    const isRepeatingDate = days[0] === 'Datas Marcadas' && repeatCount > 1;
    const groupId = (days.length > 1 || isRepeatingDate) ? `group-${Date.now()}` : null;

    let newMeals = [];

    if (isRepeatingDate) {
        const startDate = new Date(specificDate + 'T00:00:00');
        for (let i = 0; i < repeatCount; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            // Formata YYYY-MM-DD manualmente para evitar problemas de fuso horário
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            newMeals.push({
                id: `m-${Date.now()}-${i}`,
                name: 'Nova Refeição',
                time: time || '14:00',
                plate: [],
                isDone: false,
                dayOfWeek: 'Datas Marcadas',
                groupId: groupId,
                specificDate: dateStr
            });
        }
    } else {
        newMeals = days.map((day, index) => ({
            id: `m-${Date.now()}-${index}`,
            name: 'Nova Refeição',
            time: time || '14:00',
            plate: [],
            isDone: false,
            dayOfWeek: day,
            groupId: groupId,
            specificDate: day === 'Datas Marcadas' ? specificDate : null
        }));
    }

    setMealSchedule(prev => [...newMeals, ...prev]);
    setShowAddMealModal(false);
  };

  const handleEditMeal = (meal) => {
    const fixedMealNames = [
      'Café da Manhã', 'Lanche das 10h', 'Almoço', 'Chá das Três', 
      'Lanche das 17h', 'Jantar das 20h', 'Lanche das 22h', 'Ceia da Meia-noite'
    ];

    if (currentPlate.length > 0 && JSON.stringify(currentPlate) !== JSON.stringify(meal.plate)) {
      if (!window.confirm('Seu "Prato" atual contém itens diferentes. Deseja substituí-los pelos itens desta refeição para editá-los?')) {
        return;
      }
    }

    // Se a refeição pertence a um grupo, pré-seleciona todos os dias do grupo.
    const initialDays = meal.groupId
      ? mealSchedule.filter(m => m.groupId === meal.groupId).map(m => m.dayOfWeek)
      : (meal.dayOfWeek === 'Todos' 
          ? ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] 
          : [meal.dayOfWeek]);

    setCurrentPlate(meal.plate);
    setInitialPlateDays(initialDays);
    setEditingMealInfo({ name: meal.name, isFixed: fixedMealNames.includes(meal.name), groupId: meal.groupId, id: meal.id });
    
    setActiveTab('plate');
  };

  const handleDeleteMeal = (meal, contextDay) => {
    setMealToDelete(meal);
    setDeleteContextDay(contextDay);
  };

  const handleClearMeal = (meal, contextDay) => {
    setMealToClear(meal);
    setClearContextDay(contextDay);

    if (meal.groupId) {
      const groupMembers = mealSchedule.filter(m => m.groupId === meal.groupId);
      setGroupToClear(groupMembers);
    } else {
      setGroupToClear(null);
    }
  };

  const confirmClear = (daysToClear) => {
    const groupId = mealToClear.groupId;

    if (groupId) {
      setMealSchedule(prev => {
        const groupMembers = prev.filter(m => m.groupId === groupId);
        const remainingInGroup = groupMembers.filter(m => !daysToClear.includes(m.dayOfWeek));
        const dissolveGroup = remainingInGroup.length <= 1;

        return prev.map(m => {
          if (m.groupId === groupId && daysToClear.includes(m.dayOfWeek)) {
            return { ...m, plate: [], groupId: null }; // Limpa o prato e quebra o vínculo com o grupo
          }
          if (m.groupId === groupId && dissolveGroup) {
            return { ...m, groupId: null }; // Dissolve o grupo para os membros restantes
          }
          return m;
        });
      });
    } else if (mealToClear.dayOfWeek === 'Todos') {
      const newOverrides = daysToClear.map((d, i) => ({
        ...mealToClear,
        id: `m-${Date.now()}-${i}-clear`,
        dayOfWeek: d,
        plate: [],
        isDone: false,
        groupId: null,
      }));
      setMealSchedule(prev => [...prev, ...newOverrides]);
    } else {
      setMealSchedule(prev => prev.map(m => (m.id === mealToClear.id && daysToClear.includes(m.dayOfWeek)) ? { ...m, plate: [] } : m));
    }

    setMealToClear(null);
    setGroupToClear(null);
  };

  const confirmDelete = (daysToDelete) => {
    if (!mealToDelete) return;

    // This handles deleting a specific, non-'Todos' meal, which includes all custom meals.
    // It correctly removes the meal by its unique ID.
    if (mealToDelete.dayOfWeek !== 'Todos') {
        setMealSchedule(prev => prev.filter(m => m.id !== mealToDelete.id));
    } else {
        // This handles the more complex case of deleting days from a 'Todos' template.
        const allWeekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        
        // If all days are selected for deletion, the 'Todos' meal is simply removed.
        if (daysToDelete.length === allWeekDays.length) {
            setMealSchedule(prev => prev.filter(m => m.id !== mealToDelete.id));
        } else {
            // If only some days are deleted, the 'Todos' meal is replaced by
            // new individual meals for the days that were NOT selected for deletion.
            const remainingDays = allWeekDays.filter(d => !daysToDelete.includes(d));
            
            const newMeals = remainingDays.map((day, index) => ({
                ...mealToDelete,
                id: `m-${Date.now()}-${index}`,
                dayOfWeek: day,
                groupId: null // They are now individual meals
            }));

            setMealSchedule(prev => [...prev.filter(m => m.id !== mealToDelete.id), ...newMeals]);
        }
    }

    setMealToDelete(null);
  };

  const handleDuplicateConfirm = (days, newTime) => {
    const newMeals = days.map((day, index) => ({
      ...mealToDuplicate,
      id: `m-${Date.now()}-${index}-dup`,
      dayOfWeek: day,
      time: newTime,
      isDone: false
    }));
    setMealSchedule(prev => [...newMeals, ...prev]);
    setMealToDuplicate(null);
    triggerConfetti();
  };

  const handleCloneDay = (sourceDay) => {
    setCloneSourceDay(sourceDay);
    setShowCloneModal(true);
  };

  const confirmCloneDay = (targetDay, targetDate, mode) => {
    setMealSchedule(prev => {
      let newSchedule = [...prev];
      
      // 1. Se modo for 'replace', remove refeições existentes no destino
      if (mode === 'replace') {
        newSchedule = newSchedule.filter(m => {
          if (m.dayOfWeek !== targetDay) return true;
          if (targetDay === 'Datas Marcadas') return m.specificDate !== targetDate;
          return false;
        });
      }

      // 2. Encontra refeições da origem (incluindo 'Todos' se for dia da semana)
      const sourceMeals = prev.filter(m => {
        if (m.dayOfWeek === cloneSourceDay) return true;
        if (m.dayOfWeek === 'Todos') {
           // Verifica se NÃO há override no dia de origem (se houver, o override já foi pego acima)
           const hasOverride = prev.some(om => om.dayOfWeek === cloneSourceDay && om.name === m.name);
           return !hasOverride;
        }
        return false;
      });

      // 3. Cria cópias para o destino
      const clonedMeals = sourceMeals.map((m, i) => ({
        ...m,
        id: `m-${Date.now()}-${i}-clone`,
        dayOfWeek: targetDay,
        specificDate: targetDay === 'Datas Marcadas' ? targetDate : null,
        groupId: null // Quebra vínculo de grupo ao clonar para evitar edições acidentais cruzadas
      }));

      return [...newSchedule, ...clonedMeals];
    });
    triggerConfetti();
  };

  const handleResetSchedule = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    // Usa JSON.parse/stringify para garantir uma cópia profunda e limpa, forçando a atualização do estado
    setMealSchedule(JSON.parse(JSON.stringify(DEFAULT_MEAL_SCHEDULE)));
    setShowResetModal(false);
    alert("Sua agenda foi resetada com sucesso!");
  };

  const handleReorderMeal = (mealId, direction, activeDay) => {
    setMealSchedule(prev => {
      const index = prev.findIndex(m => m.id === mealId);
      if (index === -1) return prev;

      // Encontrar o índice alvo considerando apenas os itens visíveis no dia atual
      let targetIndex = -1;
      const isVisible = (m) => m.dayOfWeek === activeDay || m.dayOfWeek === 'Todos';
      
      if (direction === 'up') {
        for (let i = index - 1; i >= 0; i--) {
          if (isVisible(prev[i])) { targetIndex = i; break; }
        }
      } else {
        for (let i = index + 1; i < prev.length; i++) {
          if (isVisible(prev[i])) { targetIndex = i; break; }
        }
      }

      if (targetIndex === -1) return prev; // Não tem com quem trocar

      const newSchedule = [...prev];
      // Move o item para a nova posição (splice é mais seguro que swap para listas filtradas)
      const [movedItem] = newSchedule.splice(index, 1);
      newSchedule.splice(targetIndex, 0, movedItem);
      
      // Aciona o destaque visual
      playReorderSound();
      setMovedMealId(mealId);
      setTimeout(() => {
        setMovedMealId(null);
      }, 1500); // Duração do destaque em ms

      return newSchedule;
    });
  };

  const validateSchedule = (updatedProfile) => {
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    const warnings = new Set();

    const getNewDailyGoal = (profile) => {
      const { weight, height, age, gender, activityLevel, activityDays, targetWeight, weeks } = profile;
      if (!weight || !height || !age || !gender || !activityLevel || !targetWeight || !weeks) return 0;
      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'M' ? 5 : -161);
      const intensityFactors = { 'Sedentário': 0, 'Leve': 0.035, 'Moderada': 0.05, 'Pesada': 0.075, 'Atleta': 0.1 };
      const activityAddon = (intensityFactors[activityLevel] || 0) * (activityDays || 0);
      const tdee = bmr * (1.2 + activityAddon);
      const dailyAdjustment = ((weight - targetWeight) * 7700) / (weeks * 7);
      return Math.max(1200, tdee - dailyAdjustment);
    };

    const newDailyGoal = getNewDailyGoal(updatedProfile);
    if (newDailyGoal <= 0) return;

    const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

    daysOfWeek.forEach(day => {
      let dayCalories = 0;
      const mealsForDay = mealSchedule.filter(m => m.dayOfWeek === day || m.dayOfWeek === 'Todos');
      
      if (mealsForDay.some(m => m.plate.length > 0)) {
        mealsForDay.forEach(meal => {
          meal.plate.forEach(item => {
            const food = allFoods.find(f => f.id === item.foodId);
            if (food) {
              const weight = getFoodUnitWeight(food, item.unit) * (item.quantity || 0);
              dayCalories += (food.calories / 100) * weight;
            }
          });
        });

        const deviation = Math.abs(dayCalories - newDailyGoal) / newDailyGoal;
        if (deviation > 0.15) { // Alerta se a diferença for maior que 15%
          warnings.add(day);
        }
      }
    });

    const warningArray = Array.from(warnings);
    setScheduleWarnings(warningArray);
    if (warningArray.length > 0) {
      setTimeout(() => alert(`Atenção: Seu planejamento para ${warningArray.join(', ')} não está mais alinhado com suas novas metas. Verifique a aba Agenda.`), 500);
    }
  };

  const handleProfileUpdate = (newProfile) => {
    setUserProfile(newProfile);
    validateSchedule(newProfile);
    triggerEducationalMessage('interaction_profile_update');
  };

  const handleExportPDF = () => {
    setIsExportingPdf(true);
    setExportMode('weekly');
  };

  const handleExportSpecificPDF = () => {
    setExportMode('specific');
    setIsExportingPdf(true);
  };

  const handleWelcomeAccept = () => {
    // Inicia o contador de 72h agora
    if (!localStorage.getItem('evolufit_trial_start_v1')) {
        localStorage.setItem('evolufit_trial_start_v1', new Date().getTime().toString());
    }
    setIsTrialActive(true);
    setShowWelcome(false);
  };

  // Cálculo do Nível com Bônus de Sabedoria
  const wisdomBadgesCount = (gamification.achievements || []).filter(id => {
      const badge = BADGES_DATA.find(b => b.id === id);
      return badge && (badge.category === 'heart' || badge.category === 'water');
  }).length;
  const effectiveStreak = (gamification.maxStreak || 0) + (wisdomBadgesCount * 5); // Cada badge de sabedoria vale 5 dias

  const currentLevel = LEVELS.reduce((acc, level) => {
    return effectiveStreak >= level.days ? level : acc;
  }, LEVELS[0]);

  useEffect(() => {
    if (isExportingPdf) {
      const input = document.getElementById('pdf-export-content');
      if (input) {
        html2canvas(input, { scale: 2 }) // Aumenta a escala para melhor qualidade
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            pdf.save('EvoluFit-Agenda.pdf');
            setIsExportingPdf(false); // Finaliza o processo
          });
      } else {
        setIsExportingPdf(false); // Garante que o estado é resetado se o elemento não for encontrado
      }
    }
  }, [isExportingPdf]);

  const handleProfileCancel = () => {
    setUserProfile(prev => ({ ...prev, isSetupDone: true }));
  };

  if (showWelcomePro) {
    return (
      <>
        <WelcomeProModal onClose={() => setShowWelcomePro(false)} />
        {showProConfetti && <GoldConfetti />}
      </>
    );
  }

  if (!userProfile.isSetupDone && !showWelcome) {
    return <SetupScreen 
      userProfile={userProfile} 
      onComplete={handleProfileUpdate} 
      onCancel={userProfile.name ? handleProfileCancel : undefined}
      currentTheme={theme}
      onThemeChange={setTheme}
    />;
  }

  if (!isTrialActive && !showWelcome) {
    return (
      <>
        <TrialEndScreen />
        {needRefresh && <UpdateToast onUpdate={() => updateServiceWorker(true)} />}
      </>
    );
  }

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        plateCount={currentPlate.length}
        onRestartTour={handleRestartTour}
        onToggleManual={() => setShowManual(p => !p)}
        onInstallClick={handleInstallClick}
        showInstallButton={!!installPrompt}
        onToggleSummary={() => setShowSummaryModal(true)}
        onToggleShoppingList={() => setShowShoppingList(true)}
        onExportPDF={handleExportPDF}
        currentTheme={theme}
        onThemeChange={setTheme}
        gamification={gamification}
        level={currentLevel}
        allBadges={BADGES_DATA}
        accessStatus={accessStatus}
        isRealAdmin={isRealAdmin}
        onDebugToggle={handleDebugToggle}
      >
         {showWelcome && <WelcomeScreen onStart={handleWelcomeAccept} />}
         {showEducationalModal && currentEducationalContent && (
        <EducationalModal
          title={currentEducationalContent.title}
          message={currentEducationalContent.message}
          onClose={() => { 
            setShowEducationalModal(false); 
            localStorage.setItem(currentEducationalContent.storageKey, 'true'); 
          }}
        />
         )}
      {activeTab === 'pantry' && (
        <PantryScreen 

          allFoods={allAvailableFoods} 
          userPantry={pantryItems} 
          currentPlate={currentPlate}
          onToggle={id => setPantryItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          onRemoveFromPantry={id => setPantryItems(p => p.filter(x => x !== id))}
          onDeleteCustom={id => {
            if (window.confirm('Deseja excluir este alimento personalizado permanentemente?')) {
                setCustomFoods(c => c.filter(x => x.id !== id));
                setPantryItems(p => p.filter(x => x !== id));
            }
          }}
          onAddToPlate={id => { 
            setCurrentPlate(p => {
              if (p.find(x => x.foodId === id)) return p.filter(x => x.foodId !== id);
              return [...p, { foodId: id, quantity: 1, unit: 'Colher Sopa', multiplier: 1.0 }];
            });
            handleFoodInteraction(id); // Dispara o insight educativo
          }}
          onVoiceClick={startListening}
          isListening={isListening}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onAddManual={(foodName) => {
            addCustomFood(foodName);
            setSearchTerm(''); // Limpa a busca após adicionar
          }}
          voiceAddedFoodId={voiceAddedFoodId}
          showTour={showTour}
          tourStep={tourStep}
        />
      )}
      {activeTab === 'plate' && (
        <PlateScreen 
          key={mealSchedule.map(m => m.id).join('-')}
          initialSelectedDays={initialPlateDays}
          plate={currentPlate} 
          onRemove={id => setCurrentPlate(p => p.filter(x => x.foodId !== id))}
          onUpdate={handlePlateUpdate}
          allFoods={allAvailableFoods}
          meals={mealSchedule}
          showTour={showTour}
          tourStep={tourStep}
          editingMealInfo={editingMealInfo}
          onAssignMeal={(mealName, assignmentData, targetId, withWhom, eventLocation, description) => {
    const defaultTimes = {
        'Café da Manhã': '08:00', 'Lanche das 10h': '10:00', 'Almoço': '12:00',
        'Chá das Três': '15:00', 'Lanche das 17h': '17:00', 'Jantar das 20h': '20:00',
        'Lanche das 22h': '22:00', 'Ceia da Meia-noite': '00:00'
    };
    const time = defaultTimes[mealName] || '12:00';
    const daysOfWeekMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    // Extrai os dados do agendamento
    const { days: daysInput, date: specificDate } = assignmentData;
    const isDateSpecific = !!specificDate;

    // Case 1: Inserting into an existing custom meal ("Inserir em...")
    if (targetId) {
        setMealSchedule(prev =>
            prev.map(m => m.id === targetId ? { ...m, plate: [...currentPlate], withWhom, eventLocation, description } : m)
        );
        const targetMeal = mealSchedule.find(m => m.id === targetId);
        if (targetMeal) alert(`Prato inserido com sucesso em "${targetMeal.name}"!`);
    }
    // Case 2: Editing an existing meal (flow started from ScheduleScreen)
    else if (editingMealInfo) {
        setMealSchedule(prev => {
            let schedule = [...prev];
            const nameToUpdate = editingMealInfo.name;
            const groupIdToUpdate = editingMealInfo.groupId;
            const idToUpdate = editingMealInfo.id;

            // 1. Clean up: Remove all previous specific-day instances of this meal.
            schedule = schedule.filter(m => {
                // Proteção para Datas Marcadas: Remove apenas o que está sendo editado (grupo ou item único)
                if (m.dayOfWeek === 'Datas Marcadas') {
                     if (groupIdToUpdate && m.groupId === groupIdToUpdate) return false; // Remove membros do grupo
                     if (!groupIdToUpdate && m.id === idToUpdate) return false; // Remove item específico
                     return true; // Mantém outros itens com mesmo nome em outras datas
                }

                if (m.name !== nameToUpdate) return true;
                if (editingMealInfo.isFixed && m.dayOfWeek === 'Todos') return true;
                return false;
            });

            const days = isDateSpecific 
              ? ['Datas Marcadas'] // Direciona para a aba "Datas Marcadas"
              : (Array.isArray(daysInput) ? daysInput : [daysInput]);

            // 2. Handle 'Todos' case for fixed meals
            if (days.length === 1 && days[0] === 'Todos' && editingMealInfo.isFixed) {
                const mealToUpdateIndex = schedule.findIndex(m => m.name === nameToUpdate && m.dayOfWeek === 'Todos');
                if (mealToUpdateIndex !== -1) {
                    schedule[mealToUpdateIndex] = { ...schedule[mealToUpdateIndex], plate: [...currentPlate], withWhom, eventLocation, description };
                }
            } else {
            // 3. Add back the new specific-day instances with the updated plate.
                days.forEach(day => {
                    if (day === 'Todos') return;
                    const templateMeal = mealSchedule.find(m => m.name === nameToUpdate && m.dayOfWeek === 'Todos');
                    const mealTime = templateMeal ? templateMeal.time : (defaultTimes[nameToUpdate] || '12:00');
                    schedule.unshift({ id: `m-${Date.now()}-${day}`, name: nameToUpdate, time: mealTime, plate: [...currentPlate], isDone: false, dayOfWeek: day, withWhom, eventLocation, description, specificDate: isDateSpecific ? specificDate : null });
                });
            }
            return schedule;
        });
    }
    // Case 3: Assigning a new plate from scratch
    else {
        setMealSchedule(prev => {
            const days = isDateSpecific
              ? ['Datas Marcadas'] // Direciona para a aba "Datas Marcadas"
              : (Array.isArray(daysInput) ? daysInput.filter(d => d !== 'Todos') : [daysInput]);
            let nextSchedule = [...prev];
            const isFullWeek = daysInput.length === 7 || (Array.isArray(daysInput) && daysInput[0] === 'Todos');
            const newGroupId = days.length > 1 ? `group-${Date.now()}` : null;

            if (isFullWeek) {
                const mealToUpdateIndex = nextSchedule.findIndex(m => m.name === mealName && m.dayOfWeek === 'Todos');
                if (mealToUpdateIndex !== -1) {
                    nextSchedule[mealToUpdateIndex] = { ...nextSchedule[mealToUpdateIndex], plate: [...currentPlate], withWhom, eventLocation, description };
                }
                // Also remove any specific day overrides for this meal name
                nextSchedule = nextSchedule.filter(m => m.name !== mealName || m.dayOfWeek === 'Todos');
                return nextSchedule;
            }
            
            days.forEach(day => {
                const existingOverrideIndex = nextSchedule.findIndex(m => m.name === mealName && m.dayOfWeek === day);
                
                if (existingOverrideIndex !== -1) {
                    // If it exists, update plate and assign groupId if part of a new group
                    const oldMeal = nextSchedule[existingOverrideIndex];
                    nextSchedule[existingOverrideIndex] = { ...oldMeal, plate: [...currentPlate], groupId: newGroupId, withWhom, eventLocation, description };
                } else {
                    const templateMeal = nextSchedule.find(m => m.name === mealName && m.dayOfWeek === 'Todos');
                    const mealTime = templateMeal ? templateMeal.time : time;
                    nextSchedule.unshift({ 
                        id: `m-${Date.now()}-${day}`, name: mealName, time: mealTime, 
                        plate: [...currentPlate], isDone: false, dayOfWeek: day,
                        groupId: newGroupId,
                        withWhom, eventLocation, description,
                        specificDate: isDateSpecific ? specificDate : null
                    });
                }
            });
            return nextSchedule;
        });
    }
    
    // Common cleanup for all cases
    setCurrentPlate([]);
    setInitialPlateDays([]);
    setEditingMealInfo(null);
    setActiveTab('schedule');
    triggerEducationalMessage('interaction_schedule_confirm');
}}
          onAddMore={() => setActiveTab('pantry')}
        />
      )}
      {activeTab === 'schedule' && (
        <ScheduleScreen 
          meals={mealSchedule} 
          onUpdateMeals={setMealSchedule} 
          allFoods={allAvailableFoods}
          unitWeights={UNIT_WEIGHTS}
          scheduleWarnings={scheduleWarnings}
          onClearWarnings={() => setScheduleWarnings([])}
          onAddMeal={(context) => { setAddMealContext(context); setShowAddMealModal(true); }}
          onEditMeal={handleEditMeal}
          onClearMeal={handleClearMeal}
          onDeleteMeal={handleDeleteMeal}
          onReorderMeal={handleReorderMeal}
          movedMealId={movedMealId}
          showTour={showTour}
          tourStep={tourStep}
          waterIntake={waterIntake}
          onUpdateWater={setWaterIntake}
          waterGoal={userProfile.waterGoal}
          onUpdateWaterGoal={(newGoal) => setUserProfile(prev => ({ ...prev, waterGoal: newGoal }))}
          profile={userProfile}
          triggerConfetti={triggerConfetti}
          onMealDone={(meal) => handleMealDone(meal, userProfile)}
          onExportSpecificPDF={handleExportSpecificPDF}
          onCloneDay={handleCloneDay}
          gamification={gamification}
          // hasCelebratedWater removido daqui pois é controlado pelo App agora
        />
      )}
      {activeTab === 'brain' && (
        <BrainScreen 
          schedule={mealSchedule} 
          allFoods={allAvailableFoods} 
          profile={userProfile}
          gamification={gamification}
          badgesData={BADGES_DATA}
          onRestartTour={handleRestartTour}
          waterHistory={waterHistory}
          onEditProfile={() => setUserProfile(prev => ({ ...prev, isSetupDone: false }))}
          onResetSchedule={handleResetSchedule}
        />
      )}
      </Layout>
      {showTour && <TourOverlay step={tourStep} onNext={handleTourNext} onBack={handleTourBack} onSkip={handleTourSkip} highlightedRect={highlightedRect} />}
      {showManual && <ManualScreen 
        onClose={() => setShowManual(false)} 
        onReset={handleResetSchedule} 
        onInstallClick={handleInstallClick}
        showInstallButton={!!installPrompt}
      />}
      {showAddMealModal && <AddMealModal onClose={() => setShowAddMealModal(false)} onConfirm={handleAddMeal} context={addMealContext} />}
      {mealToDelete && (
        <DeleteMealModal 
          onClose={() => setMealToDelete(null)} 
          onConfirm={confirmDelete} 
          onDuplicate={() => {
            setMealToDuplicate(mealToDelete);
            setMealToDelete(null);
          }}
          meal={mealToDelete} 
          contextDay={deleteContextDay} 
        />
      )}
      {mealToDuplicate && <AddMealModal 
        title={`Duplicar "${mealToDuplicate.name}"`}
        buttonLabel="Confirmar Cópia"
        onClose={() => setMealToDuplicate(null)} 
        onConfirm={handleDuplicateConfirm} 
      />}
      {showConfetti && <Confetti />}
      {showProConfetti && <GoldConfetti />}
      {showResetModal && <ResetScheduleModal onClose={() => setShowResetModal(false)} onConfirm={confirmReset} />}
      {mealToClear && <ClearMealModal 
          onClose={() => { setMealToClear(null); setGroupToClear(null); }} 
          onConfirm={days => confirmClear(days)} 
          meal={mealToClear} 
          contextDay={clearContextDay}
          groupMembers={groupToClear}
        />
      }
      {showSummaryModal && (
        <ScheduleSummaryModal 
          meals={mealSchedule} 
          onClose={() => setShowSummaryModal(false)} 
        />
      )}
      {showCloneModal && <CloneDayModal sourceDay={cloneSourceDay} onClose={() => setShowCloneModal(false)} onConfirm={confirmCloneDay} mealSchedule={mealSchedule} />}
      {showShoppingList && <ShoppingListModal 
        meals={mealSchedule} 
        allFoods={allAvailableFoods} 
        onClose={() => setShowShoppingList(false)} 
        checkedItems={shoppingListCheckedItems}
        onToggleCheck={setShoppingListCheckedItems}
        hiddenItems={shoppingListHiddenItems}
        onToggleHidden={setShoppingListHiddenItems}
      />}
      {showFoodAddedModal && <FoodAddedModal 
        foodName={newlyAddedFoodName} 
        onClose={() => {
          setShowFoodAddedModal(false);
          setNewlyAddedFoodName('');
        }} 
      />
      }
      {isAlerting && <AlertAnimationOverlay />}
      {isExportingPdf && (
        <>
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <Loader className="w-12 h-12 text-white animate-spin" />
            <p className="text-white mt-4 font-bold">Gerando PDF, por favor aguarde...</p>
          </div>
          <SchedulePdfView 
            meals={mealSchedule} 
            allFoods={allAvailableFoods} 
            profile={userProfile}
            dailyGoal={getDailyGoal()}
            mode={exportMode}
          />
        </>
      )}
      {showCalorieAlert && <CalorieAlertModal excessCalories={excessCalories} onClose={() => setShowCalorieAlert(false)} />}
      {showGoalReached && <GoalReachedModal onClose={() => setShowGoalReached(false)} />}
      {showWhatsNew && <WhatsNewModal onClose={handleCloseWhatsNew} onOpenManual={() => { handleCloseWhatsNew(); setShowManual(true); }} />}
      {newUnlockedBadge && <AchievementModal badge={newUnlockedBadge} onClose={() => setNewUnlockedBadge(null)} />}
      {newLevelUpBadge && <LevelUpModal badge={newLevelUpBadge} onClose={() => setNewLevelUpBadge(null)} />}
      {showHeartExplosion && <HeartExplosion />}
      {showClapping && <ClappingFeedback message={clappingMessage} />}
      {showWaterGoalModal && <WaterGoalModal onClose={() => setShowWaterGoalModal(false)} />}
      {showWaterLostModal && <IncentiveModal onClose={() => setShowWaterLostModal(false)} title="Badge Perdido!" message="Sua barra de hidratação zerou e o emblema 'Hidratado' apagou. Beba água regularmente para recuperá-lo!" />}
    </>
  );
};


export default App;