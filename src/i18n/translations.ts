import type { Language } from '../types/poker';

export const translations = {
  en: {
    // Game UI
    title: 'The Steamboat Guide',
    subtitle: 'Learn Poker with the Master',
    startGame: 'Start Game',
    newGame: 'New Game',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',

    // Actions
    fold: 'Fold',
    call: 'Call',
    raise: 'Raise',
    check: 'Check',
    allIn: 'All In',

    // Game Info
    pot: 'Pot',
    yourChips: 'Your Chips',
    teacherChips: "Teacher's Chips",
    currentBet: 'Current Bet',
    yourHand: 'Your Hand',
    teacherHand: "Teacher's Hand",
    communityCards: 'Community Cards',

    // Hand Rankings
    'high-card': 'High Card',
    'pair': 'Pair',
    'two-pair': 'Two Pair',
    'three-of-a-kind': 'Three of a Kind',
    'straight': 'Straight',
    'flush': 'Flush',
    'full-house': 'Full House',
    'four-of-a-kind': 'Four of a Kind',
    'straight-flush': 'Straight Flush',
    'royal-flush': 'Royal Flush',

    // Suits
    hearts: 'Hearts',
    diamonds: 'Diamonds',
    clubs: 'Clubs',
    spades: 'Spades',

    // Teaching Messages
    teachingMessages: {
      welcome: "Welcome! I'm here to teach you poker. Let's start with the basics.",
      preFlop: "These are your starting cards. Decide if you want to play this hand.",
      flop: "These three community cards are the flop. How does this improve your hand?",
      turn: "This is the turn card. One more card to come!",
      river: "This is the river - the final card. Time for final betting.",
      goodFold: "Good fold! That hand wasn't worth the risk.",
      badFold: "You folded a strong hand! Be more confident with good cards.",
      strongHand: "You have a strong hand! Consider raising.",
      weakHand: "Your hand is weak. Be careful with your bets.",
      bluffDetected: "I'm bluffing! Call me out.",
      winRound: "Well played! You won this round.",
      loseRound: "I won this one. Let's analyze what happened.",
    },

    // Game Phases
    phases: {
      'pre-flop': 'Pre-Flop',
      'flop': 'Flop',
      'turn': 'Turn',
      'river': 'River',
      'showdown': 'Showdown',
      'game-over': 'Game Over',
    },

    // Results
    youWin: 'You Win!',
    teacherWins: 'Teacher Wins!',
    tie: "It's a Tie!",
    winner: 'Winner',

  },
  es: {
    // Game UI
    title: 'La Guía del Steamboat',
    subtitle: 'Aprende Póker con el Maestro',
    startGame: 'Comenzar Juego',
    newGame: 'Nuevo Juego',
    difficulty: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',

    // Actions
    fold: 'Retirarse',
    call: 'Igualar',
    raise: 'Subir',
    check: 'Pasar',
    allIn: 'All In',

    // Game Info
    pot: 'Bote',
    yourChips: 'Tus Fichas',
    teacherChips: 'Fichas del Maestro',
    currentBet: 'Apuesta Actual',
    yourHand: 'Tu Mano',
    teacherHand: 'Mano del Maestro',
    communityCards: 'Cartas Comunitarias',

    // Hand Rankings
    'high-card': 'Carta Alta',
    'pair': 'Par',
    'two-pair': 'Doble Par',
    'three-of-a-kind': 'Trío',
    'straight': 'Escalera',
    'flush': 'Color',
    'full-house': 'Full',
    'four-of-a-kind': 'Póker',
    'straight-flush': 'Escalera de Color',
    'royal-flush': 'Escalera Real',

    // Suits
    hearts: 'Corazones',
    diamonds: 'Diamantes',
    clubs: 'Tréboles',
    spades: 'Picas',

    // Teaching Messages
    teachingMessages: {
      welcome: "¡Bienvenido! Estoy aquí para enseñarte póker. Comencemos con lo básico.",
      preFlop: "Estas son tus cartas iniciales. Decide si quieres jugar esta mano.",
      flop: "Estas tres cartas comunitarias son el flop. ¿Cómo mejora tu mano?",
      turn: "Esta es la carta del turn. ¡Una carta más por venir!",
      river: "Este es el river - la carta final. Hora de la última apuesta.",
      goodFold: "¡Buen retiro! Esa mano no valía el riesgo.",
      badFold: "¡Retiraste una mano fuerte! Ten más confianza con buenas cartas.",
      strongHand: "¡Tienes una mano fuerte! Considera subir la apuesta.",
      weakHand: "Tu mano es débil. Ten cuidado con tus apuestas.",
      bluffDetected: "¡Estoy faroleando! Descúbreme.",
      winRound: "¡Bien jugado! Ganaste esta ronda.",
      loseRound: "Gané esta. Analicemos qué pasó.",
    },

    // Game Phases
    phases: {
      'pre-flop': 'Pre-Flop',
      'flop': 'Flop',
      'turn': 'Turn',
      'river': 'River',
      'showdown': 'Showdown',
      'game-over': 'Fin del Juego',
    },

    // Results
    youWin: '¡Ganaste!',
    teacherWins: '¡El Maestro Gana!',
    tie: '¡Empate!',
    winner: 'Ganador',
  }
} as const;

export const useTranslation = (language: Language) => {
  return {
    t: (key: string): string => {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    },
    language,
  };
};
