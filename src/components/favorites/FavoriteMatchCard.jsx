import React from 'react';
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, Clock, Tv, Calendar, Zap, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoriteMatchCard({ match, onRemoveFavorite, index }) {
  const matchDate = new Date(match.match_date);
  const isMatchToday = isToday(matchDate);
  const isMatchFinished = match.status === 'finished';

  const getDateLabel = () => {
    if (isMatchFinished) return "Finalizado";
    if (isMatchToday) return "Hoje";
    if (isTomorrow(matchDate)) return "Amanhã";
    return format(matchDate, "dd/MM/yyyy", { locale: ptBR });
  };

  const getCardGradient = () => {
    if (match.status === 'live') return "from-red-50 to-orange-50 border-red-200";
    if (isMatchFinished) return "from-slate-50 to-gray-50 border-slate-200";
    if (isMatchToday) return "from-blue-50 to-emerald-50 border-blue-200";
    return "from-purple-50 to-blue-50 border-purple-200";
  };
  
  const handleShare = (e) => {
    e.stopPropagation();
    const text = `Acompanhe: ${match.home_team} vs ${match.away_team} pelo ${match.championship}! ⚽️📺 #MatchTracker`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <div className={`bg-gradient-to-br ${getCardGradient()} backdrop-blur-xl hover:shadow-xl transition-all duration-300 group overflow-hidden rounded-2xl border`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">{getDateLabel()}</span>
              {match.status === 'live' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1 animate-pulse"><Zap className="w-3 h-3" /> AO VIVO</span>}
            </div>
            <button onClick={() => onRemoveFavorite(match.id)} className="hover:bg-red-50 p-1 rounded-full text-red-600 group-hover:opacity-100 opacity-70">
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{match.home_team}</h3>
            {isMatchFinished ? (
              <div className="text-2xl font-bold text-slate-800 my-2">
                <span>{match.home_score}</span>
                <span className="mx-2">-</span>
                <span>{match.away_score}</span>
              </div>
            ) : (
              <div className="text-slate-600 font-medium my-2">vs</div>
            )}
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{match.away_team}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              {!isMatchFinished && (
                <div className="flex items-center gap-2 text-slate-600"><Clock className="w-4 h-4" /> <span className="font-medium">{match.match_time}</span></div>
              )}
              <div className="flex items-center gap-2 text-slate-600"><Tv className="w-4 h-4" /> <span className="font-medium">{match.tv_channel}</span></div>
            </div>
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700 truncate" title={match.championship}>{match.championship}</p>
              <button onClick={handleShare} className="w-8 h-8 rounded-full hover:bg-blue-100 flex items-center justify-center" title="Compartilhar">
                <Share2 className="w-4 h-4 text-slate-600 hover:text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}