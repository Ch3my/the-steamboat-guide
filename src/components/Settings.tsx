import type { Difficulty, Language } from '../types/poker';

interface SettingsProps {
  difficulty: Difficulty;
  language: Language;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onLanguageChange: (language: Language) => void;
  translationKey: (key: string) => string;
}

export const Settings = ({
  difficulty,
  language,
  onDifficultyChange,
  onLanguageChange,
  translationKey,
}: SettingsProps) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-700 shadow-2xl">
      <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
        <span>⚙️</span>
        Settings
      </h3>

      <div className="space-y-6">
        {/* Language Selector */}
        <div>
          <label className="text-gray-300 text-sm font-semibold mb-3 block">
            Language / Idioma
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => onLanguageChange('en')}
              className={`
                flex-1 py-3 px-4 rounded-lg font-semibold
                transition-all duration-200
                ${language === 'en'
                  ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white border-2 border-blue-400 shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:bg-gray-700'
                }
              `}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => onLanguageChange('es')}
              className={`
                flex-1 py-3 px-4 rounded-lg font-semibold
                transition-all duration-200
                ${language === 'es'
                  ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white border-2 border-blue-400 shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-400 border-2 border-gray-700 hover:bg-gray-700'
                }
              `}
            >
              🇪🇸 Español
            </button>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="text-gray-300 text-sm font-semibold mb-3 block">
            {translationKey('difficulty')}
          </label>
          <div className="relative">
            <input
              type="range"
              min={0}
              max={2}
              value={difficulties.indexOf(difficulty)}
              onChange={(e) => onDifficultyChange(difficulties[Number(e.target.value)])}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right,
                  #10b981 0%, #10b981 ${(difficulties.indexOf(difficulty) / 2) * 50}%,
                  #eab308 ${(difficulties.indexOf(difficulty) / 2) * 50}%, #eab308 ${(difficulties.indexOf(difficulty) / 2) * 100}%,
                  #ef4444 ${(difficulties.indexOf(difficulty) / 2) * 100}%, #ef4444 100%
                )`
              }}
            />
            <div className="flex justify-between text-sm mt-2">
              {difficulties.map((diff) => (
                <span
                  key={diff}
                  className={`
                    font-semibold transition-all duration-200
                    ${difficulty === diff
                      ? diff === 'easy' ? 'text-green-400 scale-110'
                        : diff === 'medium' ? 'text-yellow-400 scale-110'
                        : 'text-red-400 scale-110'
                      : 'text-gray-500'
                    }
                  `}
                >
                  {translationKey(diff)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty Description */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-gray-300 text-sm">
            {difficulty === 'easy' && (
              <p>
                {language === 'en'
                  ? '🟢 The teacher plays conservatively and makes fewer bluffs.'
                  : '🟢 El maestro juega conservadoramente y hace menos faroles.'}
              </p>
            )}
            {difficulty === 'medium' && (
              <p>
                {language === 'en'
                  ? '🟡 The teacher plays balanced poker with moderate aggression.'
                  : '🟡 El maestro juega póker equilibrado con agresión moderada.'}
              </p>
            )}
            {difficulty === 'hard' && (
              <p>
                {language === 'en'
                  ? '🔴 The teacher plays aggressively and will bluff more often.'
                  : '🔴 El maestro juega agresivamente y faroleará más a menudo.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
