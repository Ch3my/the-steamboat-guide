import type { Player } from '../types/poker';

interface PlayerStatsProps {
  player: Player;
  translationKey: (key: string) => string;
}

export const PlayerStats = ({ player, translationKey }: PlayerStatsProps) => {
  return (
    <div className="inline-flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-gray-700 shadow-lg">
      {/* Chips Badge */}
      <div className="flex items-center gap-2">
        <div className="text-yellow-500 text-sm font-medium">
          {translationKey('yourChips')}
        </div>
        <div className="text-yellow-400 text-lg font-bold flex items-center gap-1">
          <span className="text-yellow-500 text-sm">$</span>
          {player.chips}
        </div>
      </div>

      {/* Current Bet Badge */}
      {player.currentBet > 0 && (
        <>
          <div className="w-px h-6 bg-gray-600"></div>
          <div className="text-blue-400 text-sm font-medium">
            {translationKey('currentBet')}: ${player.currentBet}
          </div>
        </>
      )}
    </div>
  );
};
