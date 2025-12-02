import { create } from 'zustand';
import type { GameState, Player, PlayerAction, Card, Difficulty, Language } from '../types/poker';
import { createDeck, shuffleDeck, dealCards } from '../utils/deck';
import { AIOpponent } from '../utils/aiOpponent';
import { evaluateHand, compareHands } from '../utils/handEvaluator';

interface GameStore extends GameState {
  // Actions
  startNewGame: () => void;
  playerAction: (action: PlayerAction, amount?: number) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setLanguage: (language: Language) => void;
  nextPhase: () => void;

  // Internal
  aiOpponent: AIOpponent;
}

const STARTING_CHIPS = 1000;
const SMALL_BLIND = 10;
const BIG_BLIND = 20;

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  communityCards: [],
  pot: 0,
  currentBet: 0,
  phase: 'pre-flop',
  deck: [],
  difficulty: 'medium',
  language: 'en',
  teachingMessage: null,
  lastAction: null,
  aiOpponent: new AIOpponent('medium', 'en'),

  startNewGame: () => {
    const shuffled = shuffleDeck(createDeck());
    const { cards: playerHand, remainingDeck: deck1 } = dealCards(shuffled, 2);
    const { cards: teacherHand, remainingDeck: deck2 } = dealCards(deck1, 2);

    const player: Player = {
      id: 'player',
      name: 'You',
      chips: STARTING_CHIPS - BIG_BLIND,
      currentBet: BIG_BLIND,
      hand: playerHand,
      folded: false,
      isTeacher: false,
    };

    const teacher: Player = {
      id: 'teacher',
      name: 'Poker Master',
      chips: STARTING_CHIPS - SMALL_BLIND,
      currentBet: SMALL_BLIND,
      hand: teacherHand,
      folded: false,
      isTeacher: true,
    };

    set({
      players: [player, teacher],
      communityCards: [],
      pot: SMALL_BLIND + BIG_BLIND,
      currentBet: BIG_BLIND,
      phase: 'pre-flop',
      deck: deck2,
      teachingMessage: get().language === 'en'
        ? "Welcome! I'm the Poker Master. Let's play and learn together."
        : "¡Bienvenido! Soy el Maestro del Póker. Juguemos y aprendamos juntos.",
      lastAction: null,
    });
  },

  setDifficulty: (difficulty: Difficulty) => {
    const { aiOpponent, language } = get();
    aiOpponent.setDifficulty(difficulty);
    set({ difficulty });
  },

  setLanguage: (language: Language) => {
    const { aiOpponent } = get();
    aiOpponent.setLanguage(language);
    set({ language });
  },

  playerAction: (action: PlayerAction, amount?: number) => {
    const state = get();
    const player = state.players[0];
    const teacher = state.players[1];

    if (player.folded || teacher.folded) return;

    let newPlayerBet = player.currentBet;
    let newPlayerChips = player.chips;
    let newPot = state.pot;

    switch (action) {
      case 'fold':
        set({
          players: [{ ...player, folded: true }, teacher],
          lastAction: { player: 'player', action: 'fold' },
          phase: 'showdown',
          teachingMessage: state.language === 'en'
            ? "You folded. Sometimes it's better to fold and save your chips."
            : "Te retiraste. A veces es mejor retirarse y guardar tus fichas.",
        });
        setTimeout(() => get().determineWinner(), 2000);
        return;

      case 'check':
        if (state.currentBet === player.currentBet) {
          set({
            lastAction: { player: 'player', action: 'check' },
          });
        }
        break;

      case 'call':
        const callAmount = state.currentBet - player.currentBet;
        newPlayerBet = state.currentBet;
        newPlayerChips -= callAmount;
        newPot += callAmount;
        set({
          players: [
            { ...player, currentBet: newPlayerBet, chips: newPlayerChips },
            teacher
          ],
          pot: newPot,
          lastAction: { player: 'player', action: 'call', amount: callAmount },
        });
        break;

      case 'raise':
        if (amount) {
          const raiseAmount = amount - player.currentBet;
          newPlayerBet = amount;
          newPlayerChips -= raiseAmount;
          newPot += raiseAmount;
          set({
            players: [
              { ...player, currentBet: newPlayerBet, chips: newPlayerChips },
              teacher
            ],
            pot: newPot,
            currentBet: amount,
            lastAction: { player: 'player', action: 'raise', amount: raiseAmount },
          });
        }
        break;

      case 'all-in':
        newPlayerBet += player.chips;
        newPot += player.chips;
        newPlayerChips = 0;
        set({
          players: [
            { ...player, currentBet: newPlayerBet, chips: 0 },
            teacher
          ],
          pot: newPot,
          currentBet: Math.max(state.currentBet, newPlayerBet),
          lastAction: { player: 'player', action: 'all-in', amount: player.chips },
        });
        break;
    }

    // AI teacher responds
    setTimeout(() => {
      get().aiTurn();
    }, 1000);
  },

  aiTurn: () => {
    const state = get();
    const teacher = state.players[1];
    const player = state.players[0];

    if (teacher.folded || player.folded) return;

    const decision = state.aiOpponent.makeDecision(
      teacher.hand,
      state.communityCards,
      state.currentBet,
      teacher.currentBet,
      teacher.chips,
      state.pot,
      state.phase
    );

    let newTeacherBet = teacher.currentBet;
    let newTeacherChips = teacher.chips;
    let newPot = state.pot;
    let newCurrentBet = state.currentBet;

    switch (decision.action) {
      case 'fold':
        set({
          players: [player, { ...teacher, folded: true }],
          lastAction: { player: 'teacher', action: 'fold' },
          teachingMessage: decision.teachingMessage || null,
          phase: 'showdown',
        });
        setTimeout(() => get().determineWinner(), 2000);
        return;

      case 'check':
        set({
          lastAction: { player: 'teacher', action: 'check' },
          teachingMessage: decision.teachingMessage || null,
        });
        break;

      case 'call':
        if (decision.amount) {
          newTeacherBet = state.currentBet;
          newTeacherChips -= decision.amount;
          newPot += decision.amount;
          set({
            players: [
              player,
              { ...teacher, currentBet: newTeacherBet, chips: newTeacherChips }
            ],
            pot: newPot,
            lastAction: { player: 'teacher', action: 'call', amount: decision.amount },
            teachingMessage: decision.teachingMessage || null,
          });
        }
        break;

      case 'raise':
        if (decision.amount) {
          newCurrentBet = teacher.currentBet + decision.amount;
          newTeacherBet = newCurrentBet;
          newTeacherChips -= decision.amount;
          newPot += decision.amount;
          set({
            players: [
              player,
              { ...teacher, currentBet: newTeacherBet, chips: newTeacherChips }
            ],
            pot: newPot,
            currentBet: newCurrentBet,
            lastAction: { player: 'teacher', action: 'raise', amount: decision.amount },
            teachingMessage: decision.teachingMessage || null,
          });
          return; // Wait for player response
        }
        break;
    }

    // If both players have matched bets, move to next phase
    const updatedState = get();
    if (updatedState.players[0].currentBet === updatedState.players[1].currentBet) {
      setTimeout(() => get().nextPhase(), 1500);
    }
  },

  nextPhase: () => {
    const state = get();
    let newPhase = state.phase;
    let newDeck = state.deck;
    let newCommunityCards = [...state.communityCards];
    let message = state.teachingMessage;

    switch (state.phase) {
      case 'pre-flop':
        const { cards: flop, remainingDeck: afterFlop } = dealCards(newDeck, 3);
        newCommunityCards = flop;
        newDeck = afterFlop;
        newPhase = 'flop';
        message = state.language === 'en'
          ? "Here comes the flop! These three cards are shared by both players."
          : "¡Aquí viene el flop! Estas tres cartas son compartidas por ambos jugadores.";
        break;

      case 'flop':
        const { cards: turn, remainingDeck: afterTurn } = dealCards(newDeck, 1);
        newCommunityCards = [...newCommunityCards, ...turn];
        newDeck = afterTurn;
        newPhase = 'turn';
        message = state.language === 'en'
          ? "The turn card is revealed. One more card to come!"
          : "Se revela la carta del turn. ¡Una carta más por venir!";
        break;

      case 'turn':
        const { cards: river, remainingDeck: afterRiver } = dealCards(newDeck, 1);
        newCommunityCards = [...newCommunityCards, ...river];
        newDeck = afterRiver;
        newPhase = 'river';
        message = state.language === 'en'
          ? "The river - the final card! Last chance to bet."
          : "El river - ¡la carta final! Última oportunidad para apostar.";
        break;

      case 'river':
        newPhase = 'showdown';
        setTimeout(() => get().determineWinner(), 1000);
        break;
    }

    // Reset bets for new betting round
    const resetPlayers = state.players.map(p => ({ ...p, currentBet: 0 }));

    set({
      phase: newPhase,
      deck: newDeck,
      communityCards: newCommunityCards,
      teachingMessage: message,
      currentBet: 0,
      players: resetPlayers,
    });
  },

  determineWinner: () => {
    const state = get();
    const player = state.players[0];
    const teacher = state.players[1];

    if (player.folded) {
      set({
        players: [
          player,
          { ...teacher, chips: teacher.chips + state.pot }
        ],
        teachingMessage: state.language === 'en'
          ? `I win this hand. You folded.`
          : `Gano esta mano. Te retiraste.`,
        phase: 'game-over',
        pot: 0,
      });
      return;
    }

    if (teacher.folded) {
      set({
        players: [
          { ...player, chips: player.chips + state.pot },
          teacher
        ],
        teachingMessage: state.language === 'en'
          ? `You win! I folded.`
          : `¡Ganaste! Me retiré.`,
        phase: 'game-over',
        pot: 0,
      });
      return;
    }

    const playerEval = evaluateHand(player.hand, state.communityCards);
    const teacherEval = evaluateHand(teacher.hand, state.communityCards);

    // Debug logging
    console.log('Player hand:', player.hand);
    console.log('Teacher hand:', teacher.hand);
    console.log('Community cards:', state.communityCards);
    console.log('Player eval:', playerEval);
    console.log('Teacher eval:', teacherEval);

    const comparison = compareHands(playerEval, teacherEval);
    console.log('Comparison result:', comparison);

    let winMessage = '';
    let updatedPlayers = state.players;

    if (comparison > 0) {
      winMessage = state.language === 'en'
        ? `You win with ${playerEval.description}! Well played!`
        : `¡Ganaste con ${playerEval.description}! ¡Bien jugado!`;
      updatedPlayers = [
        { ...player, chips: player.chips + state.pot },
        teacher
      ];
    } else if (comparison < 0) {
      winMessage = state.language === 'en'
        ? `I win with ${teacherEval.description}. Better luck next time!`
        : `Gano con ${teacherEval.description}. ¡Mejor suerte la próxima vez!`;
      updatedPlayers = [
        player,
        { ...teacher, chips: teacher.chips + state.pot }
      ];
    } else {
      winMessage = state.language === 'en'
        ? `It's a tie! We split the pot.`
        : `¡Empate! Dividimos el bote.`;
      const half = Math.floor(state.pot / 2);
      updatedPlayers = [
        { ...player, chips: player.chips + half },
        { ...teacher, chips: teacher.chips + (state.pot - half) }
      ];
    }

    set({
      players: updatedPlayers,
      teachingMessage: winMessage,
      phase: 'game-over',
      pot: 0,
    });
  },
}));
