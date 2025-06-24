import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, where, deleteDoc, limit } from 'firebase/firestore';

const WATCHED_HISTORY_COLLECTION = 'watched_history';

/**
 * Verifica se um usuário já marcou uma partida específica como assistida.
 * @param {string} userId - O ID do usuário.
 * @param {string} matchId - O ID da partida.
 * @returns {Promise<boolean>} - True se a partida já foi marcada como assistida, false caso contrário.
 */
const isMatchWatched = async (userId, matchId) => {
  const q = query(
    collection(db, WATCHED_HISTORY_COLLECTION),
    where("userId", "==", userId),
    where("matchId", "==", matchId),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

/**
 * Marca uma partida como assistida para um usuário. Não faz nada se já estiver marcada.
 * @param {string} userId - O ID do usuário.
 * @param {string} matchId - O ID da partida.
 */
export const markAsWatched = async (userId, matchId) => {
  const alreadyWatched = await isMatchWatched(userId, matchId);
  if (alreadyWatched) {
    console.log("Partida já está no histórico de assistidos.");
    return;
  }

  const watchedHistoryColRef = collection(db, WATCHED_HISTORY_COLLECTION);
  await addDoc(watchedHistoryColRef, {
    userId,
    matchId,
    watchedAt: new Date(),
  });
};

/**
 * Remove uma partida do histórico de assistidos de um usuário.
 * @param {string} userId - O ID do usuário.
 * @param {string} matchId - O ID da partida.
 */
export const unmarkAsWatched = async (userId, matchId) => {
  const q = query(
    collection(db, WATCHED_HISTORY_COLLECTION),
    where("userId", "==", userId),
    where("matchId", "==", matchId)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    deleteDoc(doc.ref);
  });
};

/**
 * Busca o histórico completo de partidas assistidas por um usuário.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<string[]>} - Uma lista de IDs das partidas assistidas.
 */
export const getWatchedHistory = async (userId) => {
  if (!userId) return [];
  
  const q = query(collection(db, WATCHED_HISTORY_COLLECTION), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data().matchId);
};