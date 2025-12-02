export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type Language = 'en' | 'es';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export type HandRank =
  | 'high-card'
  | 'pair'
  | 'two-pair'
  | 'three-of-a-kind'
  | 'straight'
  | 'flush'
  | 'full-house'
  | 'four-of-a-kind'
  | 'straight-flush'
  | 'royal-flush';

export interface HandEvaluation {
  rank: HandRank;
  value: number;
  cards: Card[];
  description: string;
  kickers: number[];
}

export type GamePhase = 'betting' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown' | 'game-over';
export type PlayerAction = 'fold' | 'call' | 'raise' | 'check' | 'all-in';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  name: string;
  chips: number;
  currentBet: number;
  hand: Card[];
  folded: boolean;
  isTeacher: boolean;
}

export interface GameState {
  players: Player[];
  communityCards: Card[];
  pot: number;
  currentBet: number;
  phase: GamePhase;
  deck: Card[];
  difficulty: Difficulty;
  language: Language;
  teachingMessage: string | null;
  lastAction: { player: string; action: PlayerAction; amount?: number } | null;
}
