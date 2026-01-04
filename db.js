import { openDB } from 'idb';
import { RAW_FOOD_DATABASE } from './constants.js';

const DB_NAME = 'EvoluFitDB';
const STORE_NAME = 'foods';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Cria a "tabela" (object store) para os alimentos
    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    
    // Cria um "índice" para permitir buscas rápidas pelo nome do alimento.
    // Isso é o coração da otimização de performance.
    store.createIndex('name_normalized', 'name_normalized');

    // NOVO: Cria um índice para a categoria, permitindo filtros rápidos.
    store.createIndex('category', 'category');
  },
});

/**
 * Popula o IndexedDB com a lista de alimentos do `constants.js` se ainda não tiver sido feito.
 * Esta função é "idempotente": ela só executa a população uma única vez.
 */
export const populateDB = async () => {
  const db = await dbPromise;
  const count = await db.count(STORE_NAME);

  // Se o banco já tem itens, não faz nada.
  if (count > 0) {
    console.log('IndexedDB já populado.');
    return;
  }

  console.log('Populando IndexedDB pela primeira vez...');
  const tx = db.transaction(STORE_NAME, 'readwrite');
  
  // Adiciona uma versão normalizada do nome para buscas case-insensitive e sem acentos.
  const foodsToStore = RAW_FOOD_DATABASE.map(food => ({
    ...food,
    name_normalized: (food.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }));

  await Promise.all(foodsToStore.map(food => tx.store.add(food)));
  await tx.done;
  console.log('IndexedDB populado com sucesso!');
};

/**
 * Busca alimentos no IndexedDB usando o índice.
 * @param {string} term O termo de busca.
 * @returns {Promise<Array>} Uma promessa que resolve para uma lista de alimentos.
 */
export const searchFoodsDB = async (term) => {
  const db = await dbPromise;
  const normalizedTerm = term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Esta é a busca otimizada que usa o índice.
  return db.getAllFromIndex(STORE_NAME, 'name_normalized', IDBKeyRange.bound(normalizedTerm, normalizedTerm + '\uffff'));
};

/**
 * Busca todos os alimentos de uma categoria específica no IndexedDB.
 * @param {string} category A categoria a ser buscada.
 * @returns {Promise<Array>} Uma promessa que resolve para uma lista de alimentos.
 */
export const getFoodsByCategoryDB = async (category) => {
  const db = await dbPromise;
  return db.getAllFromIndex(STORE_NAME, 'category', category);
};