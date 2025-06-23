import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Calendar, Share2, Zap, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format, isToday, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getTeamLogo } from '../../data/teamLogos.js';

export default function AllMatchesCard({ match, index, isFavorite, onToggleFavorite, isAdmin, onEdit, onDelete }) {
  const matchDate = new Date(match.match_date);
  const isMatchLive = match.status === 'live';
  const isMatchFinished = match.status === 'finished';

  const handleShare = (e) => {
    e.stopPropagation();
    const text = `Acompanhe: ${match.home_team} vs ${match.away_team} pelo ${match.championship}! ⚽️📺 #MatchTracker`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleActionClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="h-full w-full">
      <Link to={`/match/${match.id}`} className="block h-full">
        <div className={`relative overflow-hidden h-full flex flex-col bg-white/60 border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 rounded-2xl group ${isMatchFinished ? 'opacity-70' : ''}`}>
          
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button onClick={(e) => handleActionClick(e, onEdit)} className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center shadow-md" title="Editar Partida"><Pencil className="w-4 h-4" /></button>
              <button onClick={(e) => handleActionClick(e, onDelete)} className="w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center shadow-md" title="Excluir Partida"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}

          <div className="p-5 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(matchDate, "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              {isMatchLive && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1 animate-pulse"><Zap className="w-3 h-3" /> AO VIVO</span>}
              {isMatchFinished && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Finalizado</span>}
            </div>
            
            <div className="text-center my-4 flex-grow flex flex-col justify-center">
              <p className="text-sm font-semibold text-emerald-700 truncate mb-3">{match.championship}</p>
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center w-2/5">
                  <img src={getTeamLogo(match.home_team)} alt={match.home_team} className="w-12 h-12 object-contain mb-2"/>
                  <h3 className="text-base font-extrabold text-slate-800 leading-tight">{match.home_team}</h3>
                </div>
                
                {/* MOSTRA O PLACAR OU 'VS' */}
                {isMatchFinished ? (
                  <div className="text-2xl font-bold text-slate-800">
                    <span>{match.home_score}</span>
                    <span className="mx-2">-</span>
                    <span>{match.away_score}</span>
                  </div>
                ) : (
                  <div className="text-slate-500 font-bold text-sm">vs</div>
                )}
                
                <div className="flex flex-col items-center w-2/5">
                  <img src={getTeamLogo(match.away_team)} alt={match.away_team} className="w-12 h-12 object-contain mb-2"/>
                  <h3 className="text-base font-extrabold text-slate-800 leading-tight">{match.away_team}</h3>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t">
               {!isMatchFinished && (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Clock className="w-4 h-4" /><span>{match.match_time}</span></div>
               )}
               <div className="flex-grow"></div> {/* Espaçador para empurrar os botões para a direita se o horário não for mostrado */}
              <div className="flex items-center gap-1">
                <button onClick={(e) => handleActionClick(e, onToggleFavorite)} className="w-9 h-9 rounded-full hover:bg-red-100 flex items-center justify-center" title="Adicionar aos favoritos"><Heart className={`w-4 h-4 transition-all duration-200 ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-500 hover:text-red-500'}`} /></button>
                <button onClick={(e) => handleActionClick(e, handleShare)} className="w-9 h-9 rounded-full hover:bg-blue-100 flex items-center justify-center" title="Compartilhar no Twitter"><Share2 className="w-4 h-4 text-slate-500 hover:text-blue-600" /></button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}