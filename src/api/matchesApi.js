import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc // <-- NOVA IMPORTAÇÃO
} from 'firebase/firestore';

// References to Firestore collections
const matchesCollectionRef = collection(db, 'matches');
const favoritesCollectionRef = collection(db, 'favorites');

/**
 * Adds a new match to the 'matches' collection in Firestore.
 * @param {object} matchData - The data for the new match.
 */
export const addMatch = async (matchData) => {
  await addDoc(matchesCollectionRef, matchData);
};

/**
 * Fetches all matches from Firestore, ordered by date descending.
 * @returns {Promise<Array>} A promise that resolves to an array of match objects.
 */
export const listMatches = async () => {
  const q = query(matchesCollectionRef, orderBy('match_date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- FUNÇÕES NOVAS ABAIXO ---

/**
 * Updates an existing match document in Firestore.
 * @param {string} matchId - The ID of the match document to update.
 * @param {object} updatedData - An object containing the fields to update.
 */
export const updateMatch = async (matchId, updatedData) => {
  const matchDocRef = doc(db, 'matches', matchId);
  await updateDoc(matchDocRef, updatedData);
};

/**
 * Deletes a match document from Firestore.
 * @param {string} matchId - The ID of the match document to delete.
 */
export const deleteMatch = async (matchId) => {
  const matchDocRef = doc(db, 'matches', matchId);
  await deleteDoc(matchDocRef);
};


// --- FUNÇÕES DE FAVORITOS (sem alterações) ---

export const getFavorites = async (userEmail) => {
  if (!userEmail) return [];
  const q = query(favoritesCollectionRef, where('user_email', '==', userEmail));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addFavorite = async (matchId, userEmail) => {
  if (!userEmail) return;
  const q = query(favoritesCollectionRef, where('user_email', '==', userEmail), where('match_id', '==', matchId));
  const existing = await getDocs(q);
  if (existing.empty) {
    await addDoc(favoritesCollectionRef, { match_id: matchId, user_email: userEmail });
  }
};

export const removeFavorite = async (favoriteId) => {
  const favoriteDocRef = doc(db, 'favorites', favoriteId);
  await deleteDoc(favoriteDocRef);
};