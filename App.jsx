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
import ManualScreen from './components/ManualScreen';
import SchedulePdfView from './components/SchedulePdfView';
import { Layout } from './components/Layout';
import CalorieAlertModal from './components/CalorieAlertModal';
import GoalReachedModal from './components/GoalReachedModal';
import TrialEndScreen from './components/TrialEndScreen';
import WaterGoalModal from './components/WaterGoalModal';
import WelcomeScreen from './components/WelcomeScreen';
import UpgradeModal from './components/UpgradeModal';
import TechNutriDisplay from './components/TechNutriDisplay';
import UpdateFeedbackModal from './components/UpdateFeedbackModal';
import DataPortabilityModal from './components/DataPortabilityModal';
import UpdateToast from './components/UpdateToast';
import HeartExplosion from './components/HeartExplosion';
import ClappingFeedback from './components/ClappingFeedback';
import { Confetti, GoldConfetti } from './components/Confetti';
import AchievementModal from './components/AchievementModal';
import LevelUpModal from './components/LevelUpModal';
import IncentiveModal from './components/IncentiveModal';
import WhatsNewModal from './components/WhatsNewModal';
import WelcomeProModal from './components/WelcomeProModal';
import ResetScheduleModal from './components/ResetScheduleModal';
import TourOverlay from './components/TourOverlay';
import AddMealModal from './components/AddMealModal';
import DeleteMealModal from './components/DeleteMealModal';
import ClearMealModal from './components/ClearMealModal';
import CloneDayModal from './components/CloneDayModal';
import AlertAnimationOverlay from './components/AlertAnimationOverlay';

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

// Helper para gerar agenda padrão expandida (Sem 'Todos')
const generateDefaultSchedule = () => {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const meals = [
    { name: 'Café da Manhã', time: '08:00' }, { name: 'Lanche das 10h', time: '10:00' },
    { name: 'Almoço', time: '12:00' }, { name: 'Chá das Três', time: '15:00' },
    { name: 'Lanche das 17h', time: '17:00' }, { name: 'Jantar das 20h', time: '20:00' },
    { name: 'Lanche das 22h', time: '22:00' }, { name: 'Ceia da Meia-noite', time: '00:00' },
  ];

  let schedule = [];
  days.forEach((day, dIndex) => {
    meals.forEach((meal, mIndex) => {
      schedule.push({ id: `def-${dIndex}-${mIndex}`, name: meal.name, time: meal.time, plate: [], isDone: false, dayOfWeek: day, groupId: `def-group-${mIndex}` });
    });
  });
  return schedule;
};

const DEFAULT_MEAL_SCHEDULE = generateDefaultSchedule();

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

  // --- MIGRATION EFFECT: Converts 'Todos' to explicit days ---
  useEffect(() => {
    const migrateSchedule = () => {
      setMealSchedule(prev => {
        const hasTodos = prev.some(m => m.dayOfWeek === 'Todos');
        if (!hasTodos) return prev;

        const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        let newSchedule = [];

        prev.forEach(meal => {
          if (meal.dayOfWeek === 'Todos') {
            // Explode 'Todos' into 7 days
            const groupId = meal.groupId || `migrated-group-${meal.id}`;
            days.forEach((day, index) => {
              newSchedule.push({
                ...meal,
                id: `migrated-${meal.id}-${index}`,
                dayOfWeek: day,
                groupId: groupId,
                isDone: false, // Reseta status na migração para evitar confusão
                lastDoneDate: null
              });
            });
          } else {
            newSchedule.push(meal);
          }
        });
        return newSchedule;
      });
    };
    migrateSchedule();
  }, []);

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [earnedHeartsAmount, setEarnedHeartsAmount] = useState(1);
  const [lastSelectedFood, setLastSelectedFood] = useState(null);
  const [showUpdateFeedback, setShowUpdateFeedback] = useState(false);
  const [timeBasedUpdateAvailable, setTimeBasedUpdateAvailable] = useState(false);
  const [showDataPortability, setShowDataPortability] = useState(false);

  // Lógica do Timer de 72h para o botão Atualizar
  useEffect(() => {
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const now = Date.now();
    const threeDays = 72 * 60 * 60 * 1000; // 72 horas em milissegundos

    if (!lastCheck || (now - parseInt(lastCheck)) > threeDays) {
      setTimeBasedUpdateAvailable(true);
    }
  }, []);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

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
  const [isTrialActive, setIsTrialActive] = useState(() => {
    // Verifica o parâmetro de teste já na inicialização para evitar flash de conteúdo
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('test_trial_end') === 'true' ? false : true;
  });
  const [accessStatus, setAccessStatus] = useState('trial'); // 'trial', 'premium', 'admin'
  const [isRealAdmin, setIsRealAdmin] = useState(false); // Controle para exibir ferramentas de debug
  const CURRENT_NEWS_VERSION = 2; // Increment this number to show the modal again to users
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

  // --- Lógica de Renovação Semanal Automática (Check Periódico) ---
  useEffect(() => {
    const checkAndResetMeals = () => {
      const today = new Date();
      const todayDateStr = today.toISOString().split('T')[0];
      const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
      const todayName = daysMap[today.getDay()];

      setMealSchedule(prevSchedule => {
        let hasChanges = false;
        const newSchedule = prevSchedule.map(meal => {
          if (!meal.isDone) return meal;

          // Lógica de Reset:
          // Se a refeição pertence ao dia de HOJE (ex: Segunda), mas a data de conclusão (lastDoneDate)
          // NÃO é a data de hoje, significa que foi feita na semana passada (ou antes).
          // Então deve ser resetada para ficar disponível hoje.
          if (meal.dayOfWeek === todayName) {
             if (meal.lastDoneDate && meal.lastDoneDate !== todayDateStr) {
               hasChanges = true;
               return { ...meal, isDone: false, lastDoneDate: null };
             }
          }
          return meal;
        });

        return hasChanges ? newSchedule : prevSchedule;
      });
    };

    // Executa imediatamente ao montar
    checkAndResetMeals();

    // Executa a cada minuto para garantir que a virada do dia seja capturada se o app estiver aberto
    const interval = setInterval(checkAndResetMeals, 60000);
    
    // Adiciona listener para quando a aba ganha foco (usuário volta ao app)
    const handleFocus = () => checkAndResetMeals();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
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

      // 0.1 Backdoor de Teste Fim do Trial (Para visualizar a tela de bloqueio)
      if (urlParams.get('test_trial_end') === 'true') {
        setIsTrialActive(false);
        setShowWelcome(false);
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
        // Só mostra welcome se NÃO estiver em modo de teste de fim de trial
        if (urlParams.get('test_trial_end') !== 'true') {
            setShowWelcome(true);
        }
        setIsTrialActive(false); // Fica falso até aceitar o desafio
      } else {
        const trialEndTime = parseInt(firstAccess, 10) + (72 * 60 * 60 * 1000); // 72 horas
        setIsTrialActive(new Date().getTime() < trialEndTime);
      }
    };

    checkAccess();
  }, []);

  // --- Lógica de Atualização Manual via URL ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'manual_update') {
      // 1. Limpa a URL para não ficar em loop se o usuário der refresh manual depois
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // 2. Exibe o modal de feedback
      setShowUpdateFeedback(true);
      
      // 3. Força a atualização do SW (caso o navegador já não tenha feito isso no reload)
      updateServiceWorker(true);
    }
  }, [updateServiceWorker]);

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
      } else if (prev === 'trial') {
        alert('👁️ Modo Visualização: TELA DE BLOQUEIO (Fim do Trial)');
        return 'trial_ended';
      } else if (prev === 'trial_ended') {
        alert('👁️ Modo Visualização: TELA DE BLOQUEIO (Plano Expirado - 35 Dias)');
        return 'plan_expired';
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
      // FIX: Permitir ir para a Dispensa (pantry) sem perder o estado de edição
      if (newTab === 'pantry') {
        setActiveTab(newTab);
        return;
      }
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
      // Considera apenas refeições de hoje que estão FEITAS (Removido 'Todos')
      if (meal.dayOfWeek === today && meal.isDone) {
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

    // Rastreamento Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'meal_completed', {
        meal_name: meal.name,
        calories: Math.round(mealCalories)
      });
    }

    // Validação do Dia Atual: Se não for hoje, não dispara confetes nem alertas
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const todayName = daysMap[new Date().getDay()];
    const todayDate = new Date().toISOString().split('T')[0];
    
    const isToday = meal.dayOfWeek === todayName || (meal.dayOfWeek === 'Datas Marcadas' && meal.specificDate === todayDate);

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

    const allMealsForToday = mealSchedule.filter(m => m.dayOfWeek === todayName && m.plate.length > 0);
    const doneMealsCount = mealSchedule.filter(m => m.isDone && m.dayOfWeek === todayName).length;
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
    
    let heartsToAward = 0;
    let feedbackMsg = "Refeição registrada!";

    if (healthyCount > 0 && unhealthyCount === 0) {
        heartsToAward = 2;
        feedbackMsg = "Perfeito! 100% Saudável! (+2 ❤️)";
    } else if (healthyCount > unhealthyCount) {
        heartsToAward = 1;
        feedbackMsg = "Boa escolha! (+1 ❤️)";
    }

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

    // Ganha corações baseado na qualidade da refeição
    if (heartsToAward > 0) {
        setGamification(prev => ({ ...prev, hearts: (prev.hearts || 0) + heartsToAward }));
        setEarnedHeartsAmount(heartsToAward);
        setShowHeartExplosion(true);
        setTimeout(() => setShowHeartExplosion(false), 3000);
    }

    // Feedback de Palminhas (Sempre que consumir)
    setClappingMessage(feedbackMsg);
    setShowClapping(true);
    setTimeout(() => setShowClapping(false), 3000);

    if (shouldCelebrate) {
        setShowGoalReached(true);
    }

    // Confete removido daqui pois agora temos HeartExplosion e Clapping específicos
  };

  const handleMealUndone = (meal) => {
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    const healthyCategories = ['Vegetais', 'Frutas', 'Proteínas', 'Leguminosas', 'Gorduras'];
    const unhealthyCategories = ['Industrializados', 'Doces', 'Carboidratos'];
    
    let healthyCount = 0;
    let unhealthyCount = 0;
    
    meal.plate.forEach(item => {
        const food = allFoods.find(f => f.id === item.foodId);
        if (food) {
            if (healthyCategories.includes(food.category)) healthyCount++;
            if (unhealthyCategories.includes(food.category)) unhealthyCount++;
        }
    });
    
    let heartsToDeduct = 0;

    if (healthyCount > 0 && unhealthyCount === 0) {
        heartsToDeduct = 2;
    } else if (healthyCount > unhealthyCount) {
        heartsToDeduct = 1;
    }

    if (heartsToDeduct > 0) {
        setGamification(prev => ({ ...prev, hearts: Math.max(0, (prev.hearts || 0) - heartsToDeduct) }));
    }
  };

  // Cálculo de Calorias de Hoje
  const getTodayCalories = () => {
    const daysMap = { 0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado' };
    const today = daysMap[new Date().getDay()];
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    
    let total = 0;
    mealSchedule.forEach(meal => {
      if (meal.dayOfWeek === today) {
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
        const isToday = meal.dayOfWeek === today;
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

  // Cálculo dos Nutrientes Totais do Prato para o Display Tech
  const plateNutrientsTotal = React.useMemo(() => {
    const allFoods = [...FOOD_DATABASE, ...customFoods];
    return currentPlate.reduce((acc, item) => {
      // Garante comparação segura de IDs e conversão numérica
      const food = allFoods.find(f => String(f.id) === String(item.foodId));
      if (!food) return acc;
      
      const qty = Number(item.quantity) || 0;
      const unitWeight = Number(getFoodUnitWeight(food, item.unit)) || 0;
      const weight = unitWeight * qty;
      const factor = weight / 100;
      
      return {
        calories: acc.calories + ((Number(food.calories) || 0) * factor),
        protein: acc.protein + ((Number(food.protein) || 0) * factor),
        carbs: acc.carbs + ((Number(food.carbs) || 0) * factor),
        fat: acc.fat + ((Number(food.fat) || 0) * factor)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [currentPlate, customFoods]);

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
    // Se daysInput contiver 'Todos', expande para os 7 dias
    let days = Array.isArray(daysInput) ? daysInput : [daysInput];
    if (days.includes('Todos')) {
        days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    }
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
      : [meal.dayOfWeek];

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
    } else {
      setMealSchedule(prev => prev.map(m => (m.id === mealToClear.id && daysToClear.includes(m.dayOfWeek)) ? { ...m, plate: [] } : m));
    }

    setMealToClear(null);
    setGroupToClear(null);
  };

  const confirmDelete = (daysToDelete) => {
    if (!mealToDelete) return;

    if (mealToDelete.groupId) {
        // Se faz parte de um grupo, remove apenas os dias selecionados desse grupo
        setMealSchedule(prev => prev.filter(m => {
            if (m.groupId === mealToDelete.groupId && daysToDelete.includes(m.dayOfWeek)) return false;
            return true;
        }));
    } else {
        setMealSchedule(prev => prev.filter(m => m.id !== mealToDelete.id));
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
      const sourceMeals = prev.filter(m => m.dayOfWeek === cloneSourceDay);

      // 3. Cria cópias para o destino
      const clonedMeals = sourceMeals.map((m, i) => ({
        ...m,
        id: `m-${Date.now()}-${i}-clone`,
        dayOfWeek: targetDay,
        specificDate: targetDay === 'Datas Marcadas' ? targetDate : null,
        groupId: null, // Quebra vínculo de grupo ao clonar
        isDone: false,
        lastDoneDate: null
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
    setMealSchedule(JSON.parse(JSON.stringify(generateDefaultSchedule())));
    setShowResetModal(false);
    alert("Sua agenda foi resetada com sucesso!");
  };

  const handleReorderMeal = (mealId, direction, activeDay) => {
    setMealSchedule(prev => {
      const index = prev.findIndex(m => m.id === mealId);
      if (index === -1) return prev;

      // Encontrar o índice alvo considerando apenas os itens visíveis no dia atual
      let targetIndex = -1;
      const isVisible = (m) => m.dayOfWeek === activeDay;
      
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
      const mealsForDay = mealSchedule.filter(m => m.dayOfWeek === day);
      
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

  // --- Lógica de Restauração de Backup (Portabilidade) ---
  const handleRestoreApplicationState = (payload) => {
    // 1. Atualiza o LocalStorage (Persistência)
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'object') {
        localStorage.setItem(key, JSON.stringify(payload[key]));
      } else {
        localStorage.setItem(key, payload[key]);
      }
    });

    // 2. Atualiza o Estado do React (Reatividade Imediata)
    // Isso evita a necessidade de reload da página, mantendo a experiência fluida
    if (payload.userProfile) setUserProfile(payload.userProfile);
    if (payload.mealSchedule) setMealSchedule(payload.mealSchedule);
    if (payload.pantry) setPantryItems(payload.pantry);
    if (payload.customFoods) setCustomFoods(payload.customFoods);
    if (payload.gamification) setGamification(payload.gamification);
    if (payload.waterHistory) setWaterHistory(payload.waterHistory);
    
    // Tratamento especial para Água (Estado numérico vs Objeto no Storage)
    if (payload.waterIntake) {
      // Se o backup for do mesmo dia, restaura o valor. Se for antigo, zera.
      const today = new Date().toLocaleDateString('pt-BR');
      if (payload.waterIntake.date === today) {
        setWaterIntake(payload.waterIntake.count);
      } else {
        setWaterIntake(0);
      }
    }

    // 3. Feedback e Navegação
    setActiveTab('brain'); // Leva o usuário para o perfil para ver os dados novos
  };

  if (showWelcomePro) {
    return (
      <>
        <WelcomeProModal onClose={() => setShowWelcomePro(false)} />
        {showProConfetti && <GoldConfetti />}
      </>
    );
  }

  if (isRealAdmin && (accessStatus === 'trial_ended' || accessStatus === 'plan_expired')) {
    return <TrialEndScreen 
      variant={accessStatus === 'plan_expired' ? 'expired' : 'trial'} 
      isRealAdmin={isRealAdmin}
      onDebugToggle={handleDebugToggle}
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

  if (!userProfile.isSetupDone && !showWelcome) {
    return <SetupScreen 
      userProfile={userProfile} 
      onComplete={handleProfileUpdate} 
      onCancel={userProfile.name ? handleProfileCancel : undefined}
      currentTheme={theme}
      onThemeChange={setTheme}
    />;
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
        onOpenUpgrade={() => setShowUpgradeModal(true)}
        onManualUpdate={() => {
          localStorage.setItem('lastUpdateCheck', Date.now().toString());
          setTimeBasedUpdateAvailable(false);
          window.open('https://evolu-fit.vercel.app/?action=manual_update', '_blank');
        }}
        showUpdateButton={needRefresh[0] || timeBasedUpdateAvailable}
      >
         {needRefresh[0] && <UpdateToast onUpdate={() => updateServiceWorker(true)} />}
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
      
      {/* Display Ultra Tech (Fixo no topo das abas Dispensa e Prato) */}
      {(activeTab === 'pantry' || activeTab === 'plate') && (
        <TechNutriDisplay 
          lastFood={lastSelectedFood} 
          totalNutrition={plateNutrientsTotal} 
          isOverLimit={(getConsumedCalories() + plateNutrientsTotal.calories) > getDailyGoal()}
          activeTab={activeTab}
        />
      )}

      {activeTab === 'pantry' && (
        <PantryScreen 

          allFoods={allAvailableFoods} 
          userPantry={pantryItems} 
          currentPlate={currentPlate}
          lastSelectedFood={lastSelectedFood}
          onToggle={id => setPantryItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          onRemoveFromPantry={id => setPantryItems(p => p.filter(x => x !== id))}
          onDeleteCustom={id => {
            if (window.confirm('Deseja excluir este alimento personalizado permanentemente?')) {
                setCustomFoods(c => c.filter(x => x.id !== id));
                setPantryItems(p => p.filter(x => x !== id));
            }
          }}
          onPreview={(food) => {
            setLastSelectedFood(food);
            handleFoodInteraction(food.id);
          }}
          onAddToPlate={id => { 
            const food = allAvailableFoods.find(f => f.id === id);
            if (food) setLastSelectedFood(food);
            setCurrentPlate(p => {
              if (p.find(x => x.foodId === id)) return p.filter(x => x.foodId !== id);
              return [...p, { foodId: id, quantity: 1, unit: 'Colher Sopa', multiplier: 1.0 }];
            });
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

    // Explode 'Todos' into explicit days
    let days = isDateSpecific ? ['Datas Marcadas'] : (Array.isArray(daysInput) ? daysInput : [daysInput]);
    if (days.includes('Todos')) days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

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

            // 2. Add back updated instances
            const newGroupId = groupIdToUpdate || (days.length > 1 ? `group-${Date.now()}` : null);
            
            days.forEach((day, index) => {
                const templateMeal = mealSchedule.find(m => m.name === nameToUpdate && m.dayOfWeek === day);
                const mealTime = templateMeal ? templateMeal.time : (defaultTimes[nameToUpdate] || '12:00');
                schedule.push({ 
                    id: `m-${Date.now()}-${index}`, name: nameToUpdate, time: mealTime, 
                    plate: [...currentPlate], isDone: false, dayOfWeek: day, 
                    withWhom, eventLocation, description, 
                    specificDate: isDateSpecific ? specificDate : null,
                    groupId: newGroupId
                });
            });
            return schedule;
        });
    }
    // Case 3: Assigning a new plate from scratch
    else {
        setMealSchedule(prev => {
            let nextSchedule = [...prev];
            const newGroupId = days.length > 1 ? `group-${Date.now()}` : null;

            days.forEach(day => {
                const existingOverrideIndex = nextSchedule.findIndex(m => m.name === mealName && m.dayOfWeek === day);
                
                if (existingOverrideIndex !== -1) {
                    // If it exists, update plate and assign groupId if part of a new group
                    const oldMeal = nextSchedule[existingOverrideIndex];
                    nextSchedule[existingOverrideIndex] = { ...oldMeal, plate: [...currentPlate], groupId: newGroupId, withWhom, eventLocation, description };
                } else {
                    // Cria nova
                    nextSchedule.unshift({ 
                        id: `m-${Date.now()}-${day}`, name: mealName, time: time, 
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
          onMealUndone={handleMealUndone}
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
          onOpenDataPortability={() => setShowDataPortability(true)}
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
      {showHeartExplosion && <HeartExplosion count={earnedHeartsAmount} />}
      {showClapping && <ClappingFeedback message={clappingMessage} />}
      {showWaterGoalModal && <WaterGoalModal onClose={() => setShowWaterGoalModal(false)} />}
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      {showUpdateFeedback && <UpdateFeedbackModal onClose={() => setShowUpdateFeedback(false)} />}
      {showDataPortability && <DataPortabilityModal onClose={() => setShowDataPortability(false)} onRestore={handleRestoreApplicationState} />}
      {showWaterLostModal && <IncentiveModal onClose={() => setShowWaterLostModal(false)} title="Badge Perdido!" message="Sua barra de hidratação zerou e o emblema 'Hidratado' apagou. Beba água regularmente para recuperá-lo!" />}
    </>
  );
};


export default App;