import React, { forwardRef } from 'react';
import { getTeamLogo, getCompetitionLogo } from '../../data/teamLogos.js';
import RatingStars from '../common/RatingStars.jsx';

const ShareCard = forwardRef(({ match, averageRating = 0 }, ref) => {
  if (!match) return null;

  const isFinished = match.status === 'finished';
  const competitionLogo = getCompetitionLogo(match.championship);

  return (
    <div ref={ref} className="w-[1200px] h-[630px] bg-slate-100 flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* CÍRCULO MODIFICADO PARA PRETO */}
      <div className="absolute left-0 w-[700px] h-[700px] bg-gradient-to-br from-slate-900 to-black rounded-full -translate-x-1/4 flex items-center justify-center">
        {competitionLogo && (
          <img
            src={competitionLogo}
            alt="" // Decorativo
            crossOrigin="anonymous"
            // Opacidade ajustada para melhor visibilidade no fundo preto
            className="w-2/3 h-2/3 object-contain opacity-50" 
          />
        )}
      </div>
      
      <div className="relative z-10 w-full h-full flex items-center justify-end pr-24">
        <div className="w-1/2 text-slate-900">
          
          <p className="font-bold text-4xl mb-2">{match.championship}</p>
          <div className="w-24 h-1.5 bg-blue-600 mb-8"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <img src={getTeamLogo(match.home_team)} alt={match.home_team} crossOrigin="anonymous" className="w-24 h-24 object-contain" />
              <p className="font-extrabold text-5xl">{match.home_team}</p>
            </div>
            
            {isFinished ? (
              <div className="pl-[120px]">
                <p className="font-black text-7xl text-slate-800">{`${match.home_score} - ${match.away_score}`}</p>
              </div>
            ) : (
               <div className="pl-[120px]">
                <p className="font-light text-6xl text-slate-500">vs</p>
              </div>
            )}
            
            <div className="flex items-center gap-6">
              <img src={getTeamLogo(match.away_team)} alt={match.away_team} crossOrigin="anonymous" className="w-24 h-24 object-contain" />
              <p className="font-extrabold text-5xl">{match.away_team}</p>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t-2 border-slate-200 flex items-center gap-4">
            <p className="font-semibold text-xl text-slate-600">Nota:</p>
            <RatingStars rating={averageRating} size="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;