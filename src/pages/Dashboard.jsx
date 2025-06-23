import React from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMatches, getFavorites, addFavorite, removeFavorite } from '../api/matchesApi';
import { isToday, isTomorrow } from "date-fns";
import { motion } from "framer-motion";
import { PlusCircle } from 'lucide-react';
import TodayMatches from "../components/dashboard/TodayMatches.jsx";
import UpcomingMatches from "../components/dashboard/UpcomingMatches.jsx";
import StatsCards from "../components/dashboard/StatsCards.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const { data: matches = [], isLoading: isLoadingMatches } = useQuery({
    queryKey: ['matches'],
    queryFn: listMatches,
  });

  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: () => getFavorites(user.email),
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (matchId) => {
      const existingFavorite = favorites.find(f => f.match_id === matchId);
      if (existingFavorite) {
        await removeFavorite(existingFavorite.id);
      } else {
        await addFavorite(matchId, user.email);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.email] });
    },
  });

  const isLoading = isLoadingMatches || isLoadingFavorites;
  
  const isFavorite = (matchId) => favorites.some(f => f.match_id === matchId);

  const todayMatches = matches.filter(match => isToday(new Date(match.match_date)));
  const tomorrowMatches = matches.filter(match => isTomorrow(new Date(match.match_date)));
  const upcomingMatches = matches.filter(match => {
    const matchDate = new Date(match.match_date);
    const today = new Date();
    return !isToday(matchDate) && !isTomorrow(matchDate) && matchDate > today;
  });

  return (
    // Removido o padding extra da div principal, pois o layout agora controla isso.
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Título com tamanho de fonte responsivo */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600 text-lg">Acompanhe suas partidas favoritas</p>
            {isAdmin && (
              <Link to="/add-match">
                <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                  Adicionar Nova Partida
                </button>
              </Link>
            )}
          </motion.div>
        </div>
        {/* O componente StatsCards já tem o grid responsivo dentro dele, vamos verificar. */}
        <StatsCards
          matches={matches}
          favorites={favorites}
          todayMatches={todayMatches}
          isLoading={isLoading}
        />
        {/* O grid principal agora é empilhado por padrão e vira 2 colunas em telas grandes (lg) */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <TodayMatches
            matches={todayMatches}
            isLoading={isLoading}
            isFavorite={isFavorite}
            toggleFavorite={(matchId) => toggleFavoriteMutation.mutate(matchId)}
          />
          <UpcomingMatches
            tomorrowMatches={tomorrowMatches}
            upcomingMatches={upcomingMatches}
            isLoading={isLoading}
            isFavorite={isFavorite}
            toggleFavorite={(matchId) => toggleFavoriteMutation.mutate(matchId)}
          />
        </div>
      </div>
    </div>
  );
}