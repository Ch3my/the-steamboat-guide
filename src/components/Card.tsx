import type { Card as CardType } from '../types/poker';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  className?: string;
}

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const suitColors = {
  hearts: 'text-red-600',
  diamonds: 'text-red-600',
  clubs: 'text-gray-900',
  spades: 'text-gray-900',
};

// Get center display for all cards with proper symbol patterns
const getCenterDisplay = (rank: string, suit: string) => {
  const symbol = suitSymbols[suit as keyof typeof suitSymbols];

  // All cards - show only centered suit symbol
  return (
    <div className="text-4xl md:text-5xl">{symbol}</div>
  );
};

export const Card = ({ card, faceDown = false, className = '' }: CardProps) => {
  if (faceDown) {
    return (
      <div
        className={`
          relative w-16 h-24 md:w-20 md:h-28 rounded-lg
          bg-gradient-to-br from-blue-600 to-blue-800
          border-2 border-blue-400
          flex items-center justify-center
          shadow-lg
          transition-all duration-300 hover:scale-105
          overflow-hidden
          ${className}
        `}
      >
        <div className="text-blue-200 text-4xl font-bold opacity-30">♠</div>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent to-black/20" />
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-20 h-28 md:w-24 md:h-36 rounded-xl
        bg-white border-2 border-gray-300
        flex items-center justify-center p-2 md:p-3
        shadow-xl
        transition-all duration-300 hover:scale-105 hover:shadow-2xl
        animate-card-deal
        overflow-hidden
        ${className}
      `}
    >
      {/* Top left rank */}
      <div className={`absolute top-1 left-1 md:top-2 md:left-2 text-sm md:text-lg font-bold ${suitColors[card.suit]}`}>
        {card.rank}
      </div>

      {/* Center display */}
      <div className={`flex items-center justify-center ${suitColors[card.suit]}`}>
        {getCenterDisplay(card.rank, card.suit)}
      </div>

      {/* Bottom right rank (rotated) */}
      <div className={`absolute bottom-1 right-1 md:bottom-2 md:right-2 text-sm md:text-lg font-bold ${suitColors[card.suit]} rotate-180`}>
        {card.rank}
      </div>

      {/* Glossy effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
