import './App.css';
import { useGameStore } from './store/gameStore';
import { useTranslation } from './i18n/translations';
import { PokerTable } from './components/PokerTable';
import { PlayerArea } from './components/PlayerArea';
import { TeachingMessage } from './components/TeachingMessage';
import { Settings } from './components/Settings';
import { useState } from 'react';

function App() {
  const {
    players,
    communityCards,
    pot,
    currentBet,
    phase,
    difficulty,
    language,
    teachingMessage,
    startNewGame,
    playerAction,
    setDifficulty,
    setLanguage,
  } = useGameStore();

  const { t } = useTranslation(language);
  const [showSettings, setShowSettings] = useState(false);

  const player = players[0];
  const teacher = players[1];
  const gameStarted = players.length > 0;

  const canCheck = player && currentBet === player.currentBet;
  const isPlayerTurn = phase !== 'game-over' && phase !== 'showdown' && !player?.folded && !teacher?.folded;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mb-2">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 font-semibold">
            {t('subtitle')}
          </p>
        </header>

        {!gameStarted ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center gap-8 min-h-[60vh]">
            <div className="text-center max-w-2xl bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
              <div className="text-6xl mb-6">🎴</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {language === 'en' ? 'Welcome to Poker School!' : '¡Bienvenido a la Escuela de Póker!'}
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                {language === 'en'
                  ? 'Learn Texas Hold\'em poker by playing against the Poker Master. Each decision teaches you the game!'
                  : '¡Aprende Texas Hold\'em póker jugando contra el Maestro del Póker. Cada decisión te enseña el juego!'}
              </p>
              <button
                onClick={startNewGame}
                className="
                  bg-gradient-to-b from-green-500 to-green-700
                  hover:from-green-600 hover:to-green-800
                  text-white text-xl font-bold
                  py-4 px-12 rounded-xl
                  shadow-xl hover:shadow-2xl
                  transition-all duration-300
                  hover:scale-110 active:scale-95
                  border-2 border-green-400
                "
              >
                {t('startGame')}
              </button>
            </div>

            {/* Settings on Welcome Screen */}
            <Settings
              difficulty={difficulty}
              language={language}
              onDifficultyChange={setDifficulty}
              onLanguageChange={setLanguage}
              translationKey={t}
            />
          </div>
        ) : (
          /* Game Screen */
          <div className="space-y-6">
            {/* Settings Toggle Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="
                  bg-gray-800 hover:bg-gray-700
                  text-white font-semibold
                  py-2 px-4 rounded-lg
                  border-2 border-gray-600
                  transition-all duration-200
                  hover:scale-105
                "
              >
                ⚙️ {showSettings ? (language === 'en' ? 'Hide' : 'Ocultar') : (language === 'en' ? 'Settings' : 'Ajustes')}
              </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="animate-fade-in">
                <Settings
                  difficulty={difficulty}
                  language={language}
                  onDifficultyChange={setDifficulty}
                  onLanguageChange={setLanguage}
                  translationKey={t}
                />
              </div>
            )}

            {/* Teaching Message */}
            <TeachingMessage message={teachingMessage} />

            {/* Teacher Area */}
            {teacher && (
              <PlayerArea
                player={teacher}
                communityCards={communityCards}
                isTeacher={true}
                translationKey={t}
                gamePhase={phase}
              />
            )}

            {/* Poker Table */}
            <PokerTable
              communityCards={communityCards}
              pot={pot}
              phase={phase}
              translationKey={t}
            />

            {/* Player Area */}
            {player && (
              <PlayerArea
                player={player}
                communityCards={communityCards}
                isTeacher={false}
                translationKey={t}
                showHandStrength={communityCards.length >= 3}
                gamePhase={phase}
                currentBet={currentBet}
                canCheck={canCheck}
                pot={pot}
                isPlayerTurn={isPlayerTurn}
                onAction={playerAction}
              />
            )}

            {/* New Game Button */}
            {phase === 'game-over' && (
              <div className="text-center animate-fade-in">
                <button
                  onClick={startNewGame}
                  className="
                    bg-gradient-to-b from-blue-500 to-blue-700
                    hover:from-blue-600 hover:to-blue-800
                    text-white text-xl font-bold
                    py-4 px-12 rounded-xl
                    shadow-xl hover:shadow-2xl
                    transition-all duration-300
                    hover:scale-110 active:scale-95
                    border-2 border-blue-400
                  "
                >
                  {t('newGame')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-purple-200 text-sm">
          <p>
            {language === 'en'
              ? 'Made for learning poker fundamentals'
              : 'Hecho para aprender los fundamentos del póker'}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
