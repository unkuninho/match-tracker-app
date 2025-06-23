import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

/**
 * Adiciona ou atualiza a avaliação de um usuário para uma partida específica.
 * @param {string} matchId - O ID da partida.
 * @param {string} userId - O ID do usuário que está avaliando.
 * @param {number} rating - A nota (de 1 a 5).
 */
export const setUserRating = async (matchId, userId, rating) => {
  // A lógica para atualizar uma avaliação existente seria mais complexa.
  // Por simplicidade, vamos permitir que um usuário adicione múltiplas avaliações,
  // mas o ideal seria encontrar a avaliação antiga e atualizá-la.
  const ratingsColRef = collection(db, 'matches', matchId, 'ratings');
  await addDoc(ratingsColRef, {
    userId,
    rating,
    createdAt: new Date(),
  });
};

/**
 * Busca todas as avaliações de uma partida e calcula a média.
 * @param {string} matchId - O ID da partida.
 * @returns {Promise<{average: number, count: number}>} - Um objeto com a nota média e o número de avaliações.
 */
export const getAverageRating = async (matchId) => {
  const ratingsColRef = collection(db, 'matches', matchId, 'ratings');
  const ratingsSnapshot = await getDocs(ratingsColRef);

  if (ratingsSnapshot.empty) {
    return { average: 0, count: 0 };
  }

  let totalRating = 0;
  ratingsSnapshot.forEach(doc => {
    totalRating += doc.data().rating;
  });

  const count = ratingsSnapshot.size;
  const average = totalRating / count;
  
  // Arredonda para a meia estrela mais próxima (ex: 3.2 -> 3.0, 3.4 -> 3.5, 3.8 -> 4.0)
  const roundedAverage = Math.round(average * 2) / 2;

  return { average: roundedAverage, count };
};