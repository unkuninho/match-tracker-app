import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { setUserRating, getAverageRating } from '../../api/ratingsApi';
import RatingStars from '../common/RatingStars';
import ShareCard from './ShareCard';
import { toBlob } from 'html-to-image';
import { getTeamLogo, getCompetitionLogo } from '../../data/teamLogos';

const preloadImage = (src) => {
  if (!src) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export default function ShareModal({ isOpen, onClose, match }) {
  const { user } = useAuth();
  const [currentRating, setCurrentRating] = useState(0);
  const [cardData, setCardData] = useState({ average: 0 });
  const [isSharing, setIsSharing] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const shareCardRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isOpen || !match) return;
      setLoadingData(true);
      setCurrentRating(0);
      try {
        await Promise.all([
          preloadImage(getTeamLogo(match.home_team)),
          preloadImage(getTeamLogo(match.away_team)),
          preloadImage(getCompetitionLogo(match.championship)),
          preloadImage('/stadium-background.jpg'), // Pré-carrega o fundo
          (async () => {
            const ratingInfo = await getAverageRating(match.id);
            setCardData({ average: ratingInfo.average });
          })()
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados ou imagens:", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadInitialData();
  }, [isOpen, match]);

  const handleRatingChange = (newRating) => {
    setCurrentRating(newRating);
  };

  const handleShare = async () => {
    if (!shareCardRef.current || isSharing || currentRating === 0) return;
    if (user) await setUserRating(match.id, user.uid, currentRating);
    
    const updatedRatingInfo = await getAverageRating(match.id);
    setCardData({ average: updatedRatingInfo.average });

    setIsSharing(true);
    
    setTimeout(async () => {
      try {
        const imageBlob = await toBlob(shareCardRef.current, { cacheBust: true, pixelRatio: 2 });
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': imageBlob })]);
        
        // NOVO TEXTO DO TWEET COM PLACAR
        const siteUrl = "futracker.vercel.app";
        const championshipHashtag = match.championship.replace(/\s+/g, '');
        const matchResult = match.status === 'finished' ? `(${match.home_score} - ${match.away_score}) ` : '';
        const tweetText = `Acabei de assistir ${match.home_team} vs ${match.away_team} ${matchResult}- ${match.championship}! \n\nhttps://${siteUrl} #${championshipHashtag} #Futracker`;
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, '_blank');
        onClose();
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
        alert('Não foi possível copiar a imagem.');
      } finally {
        setIsSharing(false);
      }
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
            {!loadingData && <ShareCard ref={shareCardRef} match={match} averageRating={cardData.average} />}
          </div>
          <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }} 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Compartilhar Partida</h2>
                <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-slate-700 mb-2">Qual sua nota para esta partida?</h3>
                <RatingStars rating={currentRating} onRatingChange={handleRatingChange} isInteractive={true} size="h-8 w-8" />
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-slate-700 mb-2">Pré-visualização</h3>
                {/* PRÉ-VISUALIZAÇÃO CORRIGIDA */}
                <div className="w-full bg-slate-200 rounded-md overflow-hidden relative border">
                  {loadingData ? (
                    <div className="aspect-[1200/630] flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>
                  ) : (
                    // Usamos CSS transform scale para uma pré-visualização leve e correta
                    <div className="aspect-[1200/630] overflow-hidden">
                      <div style={{ width: '1200px', height: '630px', transform: 'scale(0.38)', transformOrigin: 'top left' }}>
                         <ShareCard match={match} averageRating={currentRating || cardData.average} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-4">
                <button 
                  onClick={handleShare} 
                  disabled={isSharing || loadingData || currentRating === 0} 
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1DA1F2] text-white font-semibold rounded-lg shadow-md hover:bg-[#0c85d0] disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isSharing ? <Loader2 className="animate-spin w-5 h-5" /> : <Twitter className="w-5 h-5" />}
                  Compartilhar no Twitter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}