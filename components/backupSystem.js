// utils/backupSystem.js

// Chaves críticas que definem o estado da aplicação
const BACKUP_KEYS = [
  'userProfile',
  'mealSchedule',
  'pantry',
  'customFoods',
  'gamification',
  'waterHistory',
  'accessInfo', // Importante: Leva o status PRO junto
  'evolufit_trial_start_v1',
  'waterIntake'
];

/**
 * Gera o objeto de backup consolidado a partir do localStorage.
 */
export const generateBackupData = () => {
  const data = {};
  
  BACKUP_KEYS.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        // Tenta parsear JSON, se falhar (ex: string simples), guarda como está
        data[key] = JSON.parse(item);
      } catch (e) {
        data[key] = item;
      }
    }
  });

  // Metadados para validação futura
  return {
    app: 'EvoluFit',
    version: 1,
    timestamp: new Date().toISOString(),
    platform: navigator.userAgent,
    payload: data
  };
};

/**
 * Valida se o objeto importado é um backup legítimo do EvoluFit.
 */
export const validateBackupData = (backupObj) => {
  if (!backupObj || typeof backupObj !== 'object') {
    throw new Error('Arquivo inválido ou corrompido.');
  }

  if (backupObj.app !== 'EvoluFit') {
    throw new Error('Este arquivo não é um backup do EvoluFit.');
  }

  if (!backupObj.payload || !backupObj.payload.userProfile) {
    throw new Error('O backup não contém dados de perfil essenciais.');
  }

  return true;
};

/**
 * Cria um arquivo Blob para download/compartilhamento.
 */
export const createBackupFile = (data) => {
  const jsonString = JSON.stringify(data, null, 2);
  return new File([jsonString], `EvoluFit_Backup_${new Date().toISOString().slice(0,10)}.json`, {
    type: 'application/json',
  });
};