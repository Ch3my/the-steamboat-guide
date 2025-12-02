import { Card } from './Card';
import type { Card as CardType } from '../types/poker';

interface PokerTableProps {
  communityCards: CardType[];
  pot: number;
  phase: string;
  translationKey: (key: string) => string;
}

export const PokerTable = ({ communityCards, pot, phase, translationKey }: PokerTableProps) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Poker Table */}
      <div className="relative bg-gradient-to-br from-green-700 to-green-900 rounded-[3rem] p-4 md:p-8 shadow-2xl border-8 border-amber-900">
        {/* Inner table felt */}
        <div className="absolute inset-4 rounded-[2.5rem] border-4 border-amber-800/30" />

        {/* Main content area with cards and pot */}
        <div className="flex flex-col items-center justify-center gap-8 min-h-[200px] pt-8">
          {/* Community Cards */}
          <div className="flex justify-center items-center gap-2 md:gap-3">
            {communityCards.length === 0 ? (
              <div className="text-green-200/30 text-lg font-semibold">
                {translationKey('communityCards')}
              </div>
            ) : (
              communityCards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  className={`
                    animate-card-flip
                    ${index === 0 || index === 1 || index === 2 ? 'animation-delay-' + (index * 200) : ''}
                    ${index === 3 ? 'animation-delay-600' : ''}
                    ${index === 4 ? 'animation-delay-800' : ''}
                  `}
                />
              ))
            )}
          </div>

          {/* Pot Display - Always below cards */}
          <div className="flex-shrink-0">
            <div className="bg-amber-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-amber-600 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-amber-200 text-xs font-semibold">{translationKey('pot')}</div>
                <div className="text-amber-100 text-xl font-bold flex items-center gap-1">
                  <span className="text-amber-400 text-sm">$</span>
                  {pot}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="bg-green-950/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
            <div className="text-green-300 text-sm font-semibold uppercase tracking-wider">
              {translationKey(`phases.${phase}`)}
            </div>
          </div>
        </div>

        {/* Decorative chips */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-white/30 shadow-lg"
              style={{ transform: `translateY(${i * -4}px)` }}
            />
          ))}
        </div>
        <div className="absolute bottom-4 left-4 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white/30 shadow-lg"
              style={{ transform: `translateY(${i * -4}px)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
