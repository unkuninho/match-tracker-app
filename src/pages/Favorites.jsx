import React, { useMemo } from "react";
import { motion } from "framer-motion";
import FavoriteMatchCard from "../components/favorites/FavoriteMatchCard.jsx";
import EmptyFavorites from "../components/favorites/EmptyFavorites.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMatches, getFavorites, removeFavorite } from '../api/matchesApi.js'; 

export default function Favorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: matches = [], isLoading: isLoadingMatches } = useQuery({ queryKey: ['matches'], queryFn: listMatches });
  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery({ queryKey: ['favorites', user?.email], queryFn: () => getFavorites(user.email), enabled: !!user });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (matchIdToRemove) => {
      // Para remover, precisamos do ID do documento do favorito, não o ID da partida
      const favoriteToRemove = favorites.find(f => f.match_id === matchIdToRemove);
      if (favoriteToRemove) {
        await removeFavorite(favoriteToRemove.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.email] });
    },
  });

  // Filtra a lista completa de partidas para manter apenas as favoritas
  const favoriteMatches = useMemo(() => {
    const favoriteMatchIds = new Set(favorites.map(f => f.match_id));
    return matches.filter(match => favoriteMatchIds.has(match.id));
  }, [matches, favorites]);

  const isLoading = isLoadingMatches || isLoadingFavorites;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 min-h-screen">
        <h1 className="text-4xl font-bold mb-2">Minhas Partidas</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Minhas Partidas</h1>
          <p className="text-slate-600 text-lg">{favoriteMatches.length} partidas salvas como favoritas</p>
        </motion.div>
        {favoriteMatches.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMatches.map((match, index) => (
              <FavoriteMatchCard 
                key={match.id} 
                match={match} 
                onRemoveFavorite={() => removeFavoriteMutation.mutate(match.id)} 
                index={index} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}