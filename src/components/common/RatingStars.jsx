import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Componente de estrelas para exibir e/ou definir uma avaliação.
 * @param {object} props
 * @param {number} [props.rating=0] - A avaliação atual a ser exibida.
 * @param {boolean} [props.isInteractive=false] - Se o usuário pode clicar para avaliar.
 * @param {function} [props.onRatingChange] - Função chamada quando a avaliação muda.
 * @param {string} [props.size='h-6 w-6'] - Tamanho dos ícones de estrela.
 */
export default function RatingStars({ rating = 0, isInteractive = false, onRatingChange, size = 'h-6 w-6' }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (isInteractive) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const displayRating = hoverRating > 0 ? hoverRating : rating;
        const isFilled = starIndex <= displayRating;
        const isHalf = starIndex - 0.5 === displayRating;

        return (
          <motion.div
            key={starIndex}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            className={`relative ${size} ${isInteractive ? 'cursor-pointer' : ''}`}
            whileHover={isInteractive ? { scale: 1.2 } : {}}
            whileTap={isInteractive ? { scale: 0.9 } : {}}
          >
            {/* Estrela de fundo (vazia) */}
            <Star className={`absolute top-0 left-0 text-slate-300 ${size}`} />

            {/* Preenchimento da estrela (cheia ou meia) */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: isFilled ? '100%' : isHalf ? '50%' : '0%' }}
            >
              <Star className={`fill-current text-amber-400 ${size}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}