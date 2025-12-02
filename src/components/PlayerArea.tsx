import { Card } from './Card';
import { ActionButtons } from './ActionButtons';
import type { Player, PlayerAction } from '../types/poker';
import { evaluateHand, getHandStrength } from '../utils/handEvaluator';
import type { Card as CardType } from '../types/poker';

interface PlayerAreaProps {
  player: Player;
  communityCards: CardType[];
  isTeacher?: boolean;
  translationKey: (key: string) => string;
  showHandStrength?: boolean;
  gamePhase?: string;
  // Action button props for player
  currentBet?: number;
  canCheck?: boolean;
  pot?: number;
  isPlayerTurn?: boolean;
  onAction?: (action: PlayerAction, amount?: number) => void;
}

export const PlayerArea = ({
  player,
  communityCards,
  isTeacher = false,
  translationKey,
  showHandStrength = false,
  gamePhase = '',
  currentBet = 0,
  canCheck = false,
  pot = 0,
  isPlayerTurn = false,
  onAction,
}: PlayerAreaProps) => {
  const evaluation = communityCards.length > 0
    ? evaluateHand(player.hand, communityCards)
    : null;
  const handStrength = evaluation ? getHandStrength(evaluation) : null;

  const strengthColors = {
    weak: 'from-red-500/20 to-red-600/20 border-red-500/50 text-red-300',
    medium: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-300',
    strong: 'from-green-500/20 to-green-600/20 border-green-500/50 text-green-300',
  };

  return (
    <div className={`relative ${isTeacher ? 'mb-8' : 'mt-8'}`}>
      {/* Main Layout with Left Panel and Centered Content */}
      <div className="flex flex-row items-start justify-center gap-8">
        {/* Far Left - Action Buttons Panel (for player only) */}
        {!isTeacher && isPlayerTurn && onAction && (
          <div className="flex-shrink-0">
            <ActionButtons
              currentBet={currentBet}
              playerBet={player.currentBet}
              playerChips={player.chips}
              pot={pot}
              canCheck={canCheck}
              onAction={onAction}
              translationKey={translationKey}
              disabled={!isPlayerTurn}
            />
          </div>
        )}

        {/* Center - Chips Badge, Cards and Hand Strength */}
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Player Chips Badge */}
          {!isTeacher && (
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
          )}

          {/* Cards */}
          <div className="flex flex-col items-center gap-4">
            {/* Cards */}
            <div className="flex gap-2 relative">
              {player.hand.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  faceDown={isTeacher && !player.folded && gamePhase !== 'showdown' && gamePhase !== 'game-over'}
                  className={`
                    ${isTeacher ? '' : 'animate-card-deal'}
                    ${!isTeacher ? 'animation-delay-' + (index * 200) : ''}
                  `}
                />
              ))}
              {player.folded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-red-500 transform -rotate-12">
                    <span className="text-red-500 text-2xl font-bold uppercase">
                      {translationKey('fold')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Hand Strength Indicator - Below Cards */}
            {!isTeacher && showHandStrength && evaluation && handStrength && (
              <div
                className={`
                  bg-gradient-to-r ${strengthColors[handStrength]}
                  backdrop-blur-sm rounded-lg px-4 py-2 border-2
                  shadow-lg animate-fade-in
                `}
              >
                <div className="text-center">
                  <div className="text-xs font-semibold uppercase opacity-80 mb-1">
                    {translationKey('yourHand')}
                  </div>
                  <div className="font-bold">
                    {translationKey(evaluation.rank)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Area (right side for teacher) */}
        {isTeacher && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl px-6 py-4 border-2 border-gray-700 shadow-xl min-w-[200px]">
              <div className="text-center">
                <div className="text-gray-300 text-lg font-bold mb-2">
                  Poker Master
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-yellow-500 text-sm">
                    {translationKey('teacherChips')}
                  </div>
                  <div className="text-yellow-400 text-xl font-bold flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">$</span>
                    {player.chips}
                  </div>
                </div>
                {player.currentBet > 0 && (
                  <div className="text-blue-400 text-sm mt-1">
                    {translationKey('currentBet')}: ${player.currentBet}
                  </div>
                )}
              </div>
            </div>

            {/* Teacher's hand during showdown/game-over */}
            {(gamePhase === 'showdown' || gamePhase === 'game-over') && evaluation && (
              <div
                className="
                  bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/50 text-purple-300
                  backdrop-blur-sm rounded-lg px-4 py-2 border-2
                  shadow-lg animate-fade-in
                "
              >
                <div className="text-center">
                  <div className="text-xs font-semibold uppercase opacity-80 mb-1">
                    {translationKey('teacherHand')}
                  </div>
                  <div className="font-bold">
                    {translationKey(evaluation.rank)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
