import { useState } from 'react';
import type { PlayerAction } from '../types/poker';

interface ActionButtonsProps {
  currentBet: number;
  playerBet: number;
  playerChips: number;
  pot: number;
  canCheck: boolean;
  onAction: (action: PlayerAction, amount?: number) => void;
  translationKey: (key: string) => string;
  disabled?: boolean;
}

export const ActionButtons = ({
  currentBet,
  playerBet,
  playerChips,
  pot,
  canCheck,
  onAction,
  translationKey,
  disabled = false,
}: ActionButtonsProps) => {
  const [raiseAmount, setRaiseAmount] = useState(currentBet * 2);
  const callAmount = currentBet - playerBet;
  const minRaise = currentBet === 0 ? pot * 0.5 : currentBet * 2;

  const handleRaise = () => {
    if (raiseAmount > playerChips) {
      onAction('all-in');
    } else {
      onAction('raise', raiseAmount);
    }
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
      <div className="flex flex-col gap-4">
        {/* Primary Actions Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onAction('fold')}
            disabled={disabled}
            className="
              bg-gradient-to-b from-red-500 to-red-700
              hover:from-red-600 hover:to-red-800
              disabled:from-gray-600 disabled:to-gray-700
              text-white font-bold py-3 px-6 rounded-lg
              shadow-lg hover:shadow-xl
              transition-all duration-200
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              border-2 border-red-400/50
            "
          >
            {translationKey('fold')}
          </button>

          {canCheck ? (
            <button
              onClick={() => onAction('check')}
              disabled={disabled}
              className="
                bg-gradient-to-b from-blue-500 to-blue-700
                hover:from-blue-600 hover:to-blue-800
                disabled:from-gray-600 disabled:to-gray-700
                text-white font-bold py-3 px-6 rounded-lg
                shadow-lg hover:shadow-xl
                transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                border-2 border-blue-400/50
              "
            >
              {translationKey('check')}
            </button>
          ) : (
            <button
              onClick={() => onAction('call', callAmount)}
              disabled={disabled || callAmount > playerChips}
              className="
                bg-gradient-to-b from-green-500 to-green-700
                hover:from-green-600 hover:to-green-800
                disabled:from-gray-600 disabled:to-gray-700
                text-white font-bold py-3 px-6 rounded-lg
                shadow-lg hover:shadow-xl
                transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                border-2 border-green-400/50
              "
            >
              <div className="text-xs opacity-80">{translationKey('call')}</div>
              <div className="text-lg">${callAmount}</div>
            </button>
          )}

          <button
            onClick={handleRaise}
            disabled={disabled || raiseAmount > playerChips}
            className="
              bg-gradient-to-b from-yellow-500 to-yellow-700
              hover:from-yellow-600 hover:to-yellow-800
              disabled:from-gray-600 disabled:to-gray-700
              text-white font-bold py-3 px-6 rounded-lg
              shadow-lg hover:shadow-xl
              transition-all duration-200
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              border-2 border-yellow-400/50
            "
          >
            <div className="text-xs opacity-80">{translationKey('raise')}</div>
            <div className="text-lg">${raiseAmount}</div>
          </button>

          <button
            onClick={() => onAction('all-in')}
            disabled={disabled || playerChips === 0}
            className="
              bg-gradient-to-b from-purple-500 to-purple-700
              hover:from-purple-600 hover:to-purple-800
              disabled:from-gray-600 disabled:to-gray-700
              text-white font-bold py-3 px-6 rounded-lg
              shadow-lg hover:shadow-xl
              transition-all duration-200
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              border-2 border-purple-400/50
            "
          >
            {translationKey('allIn')}
          </button>
        </div>

        {/* Raise Amount Slider */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <label className="text-gray-300 text-sm font-semibold mb-2 block">
            {translationKey('raise')}: ${raiseAmount}
          </label>
          <input
            type="range"
            min={minRaise}
            max={playerChips}
            step={10}
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Min: ${Math.floor(minRaise)}</span>
            <span>Max: ${playerChips}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
