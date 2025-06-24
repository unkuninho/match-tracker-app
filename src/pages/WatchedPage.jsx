import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth.js";
import { useQuery } from '@tanstack/react-query';
import { listMatches } from '../api/matchesApi.js';
import { getWatchedHistory } from '../api/watchedApi.js';
import AllMatchesCard from "../components/matches/AllMatchesCard.jsx"; // Reutilizaremos o card
import { Tv, Loader2, Heart } from 'lucide-react';

export default function WatchedPage() {
  const { user } = useAuth();

  // Busca todas as partidas (usará o cache se já tiver sido buscado em outra página)
  const { data: allMatches = [], isLoading: isLoadingMatches } = useQuery({
    queryKey: ['matches'],
    queryFn: listMatches,
  });

  // Busca o histórico de IDs de partidas assistidas pelo usuário
  const { data: watchedIds = [], isLoading: isLoadingWatched } = useQuery({
    queryKey: ['watchedHistory', user?.uid],
    queryFn: () => getWatchedHistory(user.uid),
    enabled: !!user, // Só executa se o usuário estiver logado
  });
  
  // Como não temos mais um hook central, precisamos simular a lista de favoritos aqui também
  // para passar a prop 'isFavorite' para o AllMatchesCard.
  // Em uma refatoração futura, poderíamos criar um hook 'useFavorites' para isso.
  // Por agora, vamos simular uma lista vazia para evitar erros.
  const favorites = []; 

  const isLoading = isLoadingMatches || isLoadingWatched;

  // Filtra a lista completa de partidas para encontrar apenas as que foram assistidas
  const watchedMatches = useMemo(() => {
    if (!allMatches.length || !watchedIds.length) return [];
    const watchedIdSet = new Set(watchedIds);
    return allMatches.filter(match => watchedIdSet.has(match.id));
  }, [allMatches, watchedIds]);
  
  const isFavorite = (matchId) => favorites.some(fav => fav.matchId === matchId);

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Meus Assistidos</h1>
          <p className="text-slate-600 text-lg">Seu histórico de partidas que você já viu.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div>
            {watchedMatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {watchedMatches.map((match, index) => (
                  <AllMatchesCard
                    key={match.id}
                    match={match}
                    index={index}
                    isFavorite={isFavorite(match.id)} // Simulado, sempre false
                    onToggleFavorite={() => {}} // Função vazia
                    isAdmin={false}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tv className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Nenhuma partida assistida</h3>
                <p className="text-slate-600 mt-2">Marque partidas finalizadas como assistidas para vê-las aqui.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}