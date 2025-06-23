import React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Tv, Heart, CalendarDays, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function UpcomingMatches({ tomorrowMatches, upcomingMatches, isLoading, isFavorite, toggleFavorite }) {
  const allUpcoming = [...tomorrowMatches, ...upcomingMatches];

  const handleShare = (e, match) => {
    e.stopPropagation();
    const text = `Vou assistir: ${match.home_team} vs ${match.away_team} pelo ${match.championship}! ⚽️📺 #MatchTracker`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="bg-white/60 border border-slate-200/60 shadow-xl rounded-2xl">
        <div className="border-b p-6"><h2 className="flex items-center gap-3 text-xl font-bold text-slate-900"><CalendarDays className="w-6 h-6 text-emerald-600" /> Próximas Partidas</h2></div>
        <div className="p-6 space-y-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-20 w-full rounded-xl bg-slate-200 animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 border border-slate-200/60 shadow-xl rounded-2xl">
      <div className="border-b p-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900"><CalendarDays className="w-6 h-6 text-emerald-600" /> Próximas Partidas</h2>
        {allUpcoming.length > 0 && <span className="bg-emerald-100 text-emerald-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">{allUpcoming.length}</span>}
      </div>
      <div className="p-6">
        {allUpcoming.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Nenhuma partida programada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {allUpcoming.slice(0, 8).map((match, index) => (
              <motion.div key={match.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-3 border border-slate-200/60 hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-slate-600">{format(new Date(match.match_date), "dd 'de' MMMM", { locale: ptBR })}</div>
                  <div className="flex items-center">
                    <button onClick={(e) => handleShare(e, match)} className="w-6 h-6 p-0 hover:bg-blue-100 flex items-center justify-center rounded-full"><Share2 className="w-3 h-3 text-slate-600" /></button>
                    <button onClick={() => toggleFavorite(match.id)} className="w-6 h-6 p-0 hover:bg-red-100 flex items-center justify-center rounded-full">
                      <Heart className={`w-3 h-3 ${isFavorite(match.id) ? 'fill-current text-red-600' : 'text-slate-600'}`} />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900 mb-2">{match.home_team} <span className="text-slate-600">vs</span> {match.away_team}</div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{match.match_time}</span></div>
                  <div className="flex items-center gap-1"><Tv className="w-3 h-3" /><span>{match.tv_channel}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}