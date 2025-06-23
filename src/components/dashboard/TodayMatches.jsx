import React from 'react';
import { Clock, Tv, Heart, Zap, Share2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TodayMatches({ matches, isLoading, isFavorite, toggleFavorite }) {
  const handleShare = (e, match) => {
    e.stopPropagation();
    const text = `Acompanhe: ${match.home_team} vs ${match.away_team} pelo ${match.championship}! ⚽️📺 #MatchTracker`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const groupedMatches = matches.reduce((acc, match) => {
    const championship = match.championship || "Outros";
    if (!acc[championship]) {
      acc[championship] = [];
    }
    acc[championship].push(match);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="bg-white/60 border border-slate-200/60 shadow-xl rounded-2xl">
        <div className="border-b p-6"><h2 className="flex items-center gap-3 text-xl font-bold text-slate-900"><Calendar className="w-6 h-6 text-blue-600" /> Partidas de Hoje</h2></div>
        <div className="p-6 space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="h-24 w-full rounded-xl bg-slate-200 animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 border border-slate-200/60 shadow-xl rounded-2xl">
      <div className="border-b p-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900"><Calendar className="w-6 h-6 text-blue-600" /> Partidas de Hoje</h2>
        {matches.length > 0 && <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">{matches.length}</span>}
      </div>
      <div className="p-6">
        <AnimatePresence>
          {matches.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Nenhuma partida hoje</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedMatches).map(championship => (
                <div key={championship}>
                  <h3 className="text-md font-bold text-emerald-700 mb-3 border-b-2 border-emerald-100 pb-1">{championship}</h3>
                  <div className="space-y-4">
                    {groupedMatches[championship].map((match, index) => {
                      const isMatchFinished = match.status === 'finished';
                      return (
                        <motion.div key={match.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200/60 hover:shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {/* Lógica de exibição: Placar ou Horário */}
                              {isMatchFinished ? (
                                <span className="text-sm font-bold text-slate-700">Finalizado</span>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4 text-slate-600" />
                                  <span className="text-sm font-semibold text-slate-700">{match.match_time}</span>
                                </>
                              )}
                              {match.status === 'live' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1 animate-pulse"><Zap className="w-3 h-3" /> AO VIVO</span>}
                            </div>
                            <div className="flex items-center">
                              <button onClick={(e) => handleShare(e, match)} className="w-8 h-8 rounded-full hover:bg-blue-100 flex items-center justify-center"><Share2 className="w-4 h-4 text-slate-600" /></button>
                              <button onClick={() => toggleFavorite(match.id)} className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center">
                                <Heart className={`w-4 h-4 ${isFavorite(match.id) ? 'fill-current text-red-600' : 'text-slate-600'}`} />
                              </button>
                            </div>
                          </div>
                          <div className="text-center mb-3">
                            <div className="flex items-center justify-center text-lg font-bold text-slate-900">
                              <span className="text-center">{match.home_team}</span>
                              {isMatchFinished ? (
                                <span className="mx-4 text-xl">{match.home_score} - {match.away_score}</span>
                              ) : (
                                <span className="mx-4 text-slate-600">vs</span>
                              )}
                              <span className="text-center">{match.away_team}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1 text-slate-600"><Tv className="w-4 h-4" /><span>{match.tv_channel}</span></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}