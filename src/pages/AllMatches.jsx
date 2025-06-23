import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ListFilter, Search, Trophy, CalendarCheck, CalendarClock, CalendarX, Calendar } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMatches, getFavorites, addFavorite, removeFavorite, updateMatch, deleteMatch } from '../api/matchesApi.js';
import AllMatchesCard from "../components/matches/AllMatchesCard.jsx";
import EditMatchModal from "../components/matches/EditMatchModal.jsx";
import { isToday, isWithinInterval, startOfToday, addDays, isPast } from 'date-fns';

export default function AllMatches() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChampionship, setSelectedChampionship] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  const { data: matches = [], isLoading: isLoadingMatches } = useQuery({ queryKey: ['matches'], queryFn: listMatches });
  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery({ queryKey: ['favorites', user?.email], queryFn: () => getFavorites(user.email), enabled: !!user });
  
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (matchId) => {
      const existingFavorite = favorites.find(f => f.match_id === matchId);
      if (existingFavorite) { await removeFavorite(existingFavorite.id); } else { await addFavorite(matchId, user.email); }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['favorites', user?.email] }); },
  });

  const updateMatchMutation = useMutation({
    mutationFn: (updatedMatchData) => updateMatch(updatedMatchData.id, updatedMatchData),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['matches'] }); setIsModalOpen(false); },
  });

  const deleteMatchMutation = useMutation({
    mutationFn: (matchId) => deleteMatch(matchId),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['matches'] }); },
  });

  const isLoading = isLoadingMatches || isLoadingFavorites;
  const isFavorite = (matchId) => favorites.some(f => f.match_id === matchId);

  const handleEditClick = (matchToEdit) => { setEditingMatch(matchToEdit); setIsModalOpen(true); };
  const handleDeleteClick = (matchId) => { if (window.confirm("Tem certeza?")) { deleteMatchMutation.mutate(matchId); } };

  const championships = useMemo(() => [...new Set(matches.map(m => m.championship))].filter(Boolean).sort(), [matches]);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const searchTermLower = searchTerm.toLowerCase();
      const teamMatch = match.home_team.toLowerCase().includes(searchTermLower) || match.away_team.toLowerCase().includes(searchTermLower);
      const championshipMatch = selectedChampionship === "all" || match.championship === selectedChampionship;
      
      let dateMatch = false;
      const today = startOfToday();
      const matchDate = new Date(match.match_date);

      switch(dateFilter) {
        case 'today': dateMatch = isToday(matchDate); break;
        case 'next7': dateMatch = isWithinInterval(matchDate, { start: today, end: addDays(today, 7) }); break;
        case 'finished': dateMatch = isPast(matchDate) && !isToday(matchDate); break;
        default: dateMatch = true;
      }
      return teamMatch && championshipMatch && dateMatch;
    });
  }, [matches, searchTerm, selectedChampionship, dateFilter]);

  const dateFilterOptions = [
    { key: 'all', label: 'Todas', icon: Calendar },
    { key: 'today', label: 'Hoje', icon: CalendarCheck },
    { key: 'next7', label: 'Próximos 7 dias', icon: CalendarClock },
    { key: 'finished', label: 'Finalizadas', icon: CalendarX },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* Título responsivo */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Todas as Partidas</h1>
          <p className="text-slate-600 text-lg">Navegue, filtre e encontre seus jogos preferidos</p>
        </motion.div>
        
        {/* Filtros de data agora quebram a linha em telas pequenas */}
        <div className="mb-4 flex flex-wrap gap-2">
          {dateFilterOptions.map(opt => (
            <button key={opt.key} onClick={() => setDateFilter(opt.key)} className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors ${dateFilter === opt.key ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
              <opt.icon className="w-4 h-4"/>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Filtros de busca empilhados no mobile (flex-col) e lado a lado no desktop (md:flex-row) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8 flex flex-col md:flex-row gap-4 p-4 bg-white/60 rounded-2xl shadow-lg">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input placeholder="Buscar por time..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 w-full h-12 md:h-14 text-base border border-slate-200 rounded-xl focus:border-blue-400 p-2" />
          </div>
          <div className="relative flex-grow md:max-w-xs">
            <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select value={selectedChampionship} onChange={e => setSelectedChampionship(e.target.value)} className="pl-12 w-full h-12 md:h-14 text-base border border-slate-200 rounded-xl p-2 bg-white appearance-none">
              <option value="all">Todos os Campeonatos</option>
              {championships.map(champ => <option key={champ} value={champ}>{champ}</option>)}
            </select>
          </div>
        </motion.div>

        {isLoading ? (
          // Grid responsivo para o skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array(8).fill(0).map((_, i) => <div key={i} className="h-56 rounded-2xl bg-slate-200 animate-pulse" />)}
          </div>
        ) : (
          // Grid responsivo para os cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMatches.length > 0 ? filteredMatches.map((match, index) => (
              <AllMatchesCard key={match.id} match={match} index={index} isFavorite={isFavorite(match.id)} onToggleFavorite={() => toggleFavoriteMutation.mutate(match.id)} isAdmin={isAdmin} onEdit={() => handleEditClick(match)} onDelete={() => handleDeleteClick(match.id)} />
            )) : (
              <div className="col-span-full text-center py-16">
                <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Nenhuma partida encontrada</h3>
                <p className="text-slate-600 mt-2">Tente ajustar sua busca ou filtros.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <EditMatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} match={editingMatch} onSave={(data) => updateMatchMutation.mutate(data)} />
    </div>
  );
}