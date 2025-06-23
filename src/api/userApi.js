import { db } from '../firebase';
import { doc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

/**
 * Verifica se um username já está em uso por outro usuário.
 * @param {string} username - O username a ser verificado.
 * @param {string} currentUserId - O ID do usuário atual, para excluí-lo da busca.
 * @returns {Promise<boolean>} Retorna true se for único, false caso contrário.
 */
export const isUsernameUnique = async (username, currentUserId) => {
  if (!username) return true; // Se o username for vazio, não valida
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return true; // Nenhum usuário tem esse username.
  }
  
  const isTakenByOther = querySnapshot.docs.some(doc => doc.id !== currentUserId);
  return !isTakenByOther;
};

/**
 * Atualiza os dados do perfil de um usuário no Firestore.
 * @param {string} userId - O ID do usuário a ser atualizado.
 * @param {object} data - Os dados a serem atualizados (ex: { fullName, username }).
 */
export const updateUserProfile = async (userId, data) => {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
};