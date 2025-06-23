// src/api/commentsApi.js

import { db } from '../firebase.js';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

const commentsCollectionRef = collection(db, 'comments');

/**
 * Adiciona um novo comentário a uma partida.
 * @param {string} matchId - O ID da partida.
 * @param {object} commentData - Dados do comentário (text, user).
 */
export const addComment = async (matchId, commentData) => {
  await addDoc(commentsCollectionRef, {
    matchId,
    ...commentData,
    createdAt: serverTimestamp(), // Adiciona um timestamp do servidor
  });
};

/**
 * Busca todos os comentários de uma partida específica.
 * @param {string} matchId - O ID da partida.
 * @returns {Promise<Array>} Lista de comentários.
 */
export const getCommentsForMatch = async (matchId) => {
  const q = query(
    commentsCollectionRef, 
    where('matchId', '==', matchId),
    orderBy('createdAt', 'desc') // Mais recentes primeiro
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};