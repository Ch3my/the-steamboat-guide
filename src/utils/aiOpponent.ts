import type { Card, Difficulty, PlayerAction, GamePhase } from '../types/poker';
import { evaluateHand, getHandStrength } from './handEvaluator';

interface AIDecision {
  action: PlayerAction;
  amount?: number;
  teachingMessage?: string;
}

export class AIOpponent {
  private difficulty: Difficulty;
  private language: 'en' | 'es';

  constructor(difficulty: Difficulty, language: 'en' | 'es' = 'en') {
    this.difficulty = difficulty;
    this.language = language;
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
  }

  setLanguage(language: 'en' | 'es') {
    this.language = language;
  }

  makeDecision(
    hand: Card[],
    communityCards: Card[],
    currentBet: number,
    playerBet: number,
    chips: number,
    pot: number,
    phase: GamePhase
  ): AIDecision {
    const evaluation = communityCards.length > 0
      ? evaluateHand(hand, communityCards)
      : evaluateHand(hand, []);

    const handStrength = getHandStrength(evaluation);
    const betToCall = currentBet - playerBet;
    const potOdds = betToCall / (pot + betToCall);

    // Adjust AI behavior based on difficulty
    const aggressiveness = this.getAggressiveness();
    const bluffChance = this.getBluffChance();
    const shouldBluff = Math.random() < bluffChance;

    // Pre-flop strategy
    if (phase === 'pre-flop') {
      return this.preFlopStrategy(hand, betToCall, chips, handStrength, aggressiveness, shouldBluff);
    }

    // Post-flop strategy
    return this.postFlopStrategy(
      evaluation,
      handStrength,
      betToCall,
      chips,
      pot,
      potOdds,
      aggressiveness,
      shouldBluff,
      phase
    );
  }

  private preFlopStrategy(
    hand: Card[],
    betToCall: number,
    chips: number,
    handStrength: 'weak' | 'medium' | 'strong',
    aggressiveness: number,
    shouldBluff: boolean
  ): AIDecision {
    const highCards = hand.filter(c => ['A', 'K', 'Q', 'J'].includes(c.rank));
    const isPair = hand[0].rank === hand[1].rank;
    const isSuited = hand[0].suit === hand[1].suit;
    const isHard = this.difficulty === 'hard';

    // Strong starting hands
    if (isPair || highCards.length === 2) {
      if (betToCall === 0) {
        // Hard mode: raise bigger and more often
        const raiseAmount = isHard
          ? Math.floor(chips * 0.15 * aggressiveness)
          : Math.floor(chips * 0.1 * aggressiveness);
        return {
          action: 'raise',
          amount: raiseAmount,
          teachingMessage: this.getTeachingMessage('strongPreFlop'),
        };
      }
      // Hard mode: re-raise more often
      const reRaiseChance = isHard ? 0.85 : 0.7;
      return {
        action: Math.random() < reRaiseChance ? 'raise' : 'call',
        amount: Math.random() < reRaiseChance ? Math.floor(betToCall * 2.5) : betToCall,
        teachingMessage: this.getTeachingMessage('goodHand'),
      };
    }

    // Medium hands
    if (isSuited || highCards.length === 1) {
      if (betToCall === 0) {
        // Hard mode: more aggressive with medium hands
        if (isHard && Math.random() < 0.4) {
          return {
            action: 'raise',
            amount: Math.floor(chips * 0.08),
            teachingMessage: this.getTeachingMessage('mediumHand'),
          };
        }
        return {
          action: 'check',
          teachingMessage: this.getTeachingMessage('mediumHand'),
        };
      }
      const callThreshold = isHard ? chips * 0.15 : chips * 0.1;
      if (betToCall < callThreshold) {
        return {
          action: 'call',
          amount: betToCall,
          teachingMessage: this.getTeachingMessage('calling'),
        };
      }
      return {
        action: 'fold',
        teachingMessage: this.getTeachingMessage('fold'),
      };
    }

    // Weak hands - bluff much more on hard difficulty
    if (shouldBluff && betToCall === 0) {
      const bluffAmount = isHard ? Math.floor(chips * 0.12) : Math.floor(chips * 0.05);
      return {
        action: 'raise',
        amount: bluffAmount,
        teachingMessage: this.getTeachingMessage('bluff'),
      };
    }

    if (betToCall === 0) {
      return {
        action: 'check',
        teachingMessage: this.getTeachingMessage('weakHand'),
      };
    }

    return {
      action: 'fold',
      teachingMessage: this.getTeachingMessage('fold'),
    };
  }

  private postFlopStrategy(
    evaluation: any,
    handStrength: 'weak' | 'medium' | 'strong',
    betToCall: number,
    chips: number,
    pot: number,
    potOdds: number,
    aggressiveness: number,
    shouldBluff: boolean,
    phase: GamePhase
  ): AIDecision {
    const isHard = this.difficulty === 'hard';

    // Strong hand strategy
    if (handStrength === 'strong') {
      if (betToCall === 0) {
        // Hard mode: bet bigger with strong hands (pot-sized to overbet)
        const betSize = isHard
          ? Math.floor(pot * (0.75 + Math.random() * 0.5) * aggressiveness) // 75%-125% pot
          : Math.floor(pot * 0.5 * aggressiveness);
        return {
          action: 'raise',
          amount: betSize,
          teachingMessage: this.getTeachingMessage('strongHand'),
        };
      }
      if (betToCall < chips * 0.3) {
        // Hard mode: re-raise almost always with strong hands
        const reRaiseChance = isHard ? 0.95 : 0.8;
        const raiseMultiplier = isHard ? 2.5 : 2;
        return {
          action: Math.random() < reRaiseChance ? 'raise' : 'call',
          amount: Math.random() < reRaiseChance ? Math.floor(betToCall * raiseMultiplier) : betToCall,
          teachingMessage: this.getTeachingMessage('raising'),
        };
      }
      return {
        action: 'call',
        amount: betToCall,
        teachingMessage: this.getTeachingMessage('calling'),
      };
    }

    // Medium hand strategy
    if (handStrength === 'medium') {
      if (betToCall === 0) {
        // Hard mode: bet more often with medium hands
        const raiseChance = isHard ? 0.65 : 0.5;
        const action = Math.random() < raiseChance ? 'raise' : 'check';
        const betSize = isHard ? Math.floor(pot * 0.5) : Math.floor(pot * 0.3);
        return {
          action,
          amount: action === 'raise' ? betSize : undefined,
          teachingMessage: this.getTeachingMessage('mediumHand'),
        };
      }
      const callThreshold = isHard ? chips * 0.2 : chips * 0.15;
      if (potOdds < 0.3 || betToCall < callThreshold) {
        return {
          action: 'call',
          amount: betToCall,
          teachingMessage: this.getTeachingMessage('calling'),
        };
      }
      return {
        action: 'fold',
        teachingMessage: this.getTeachingMessage('fold'),
      };
    }

    // Weak hand strategy - bluff much more on hard difficulty
    if (shouldBluff && betToCall === 0) {
      // Hard mode: bluff on any street, bigger bluffs
      const bluffSize = isHard
        ? Math.floor(pot * (0.6 + Math.random() * 0.4)) // 60%-100% pot bluffs
        : Math.floor(pot * 0.4);
      return {
        action: 'raise',
        amount: bluffSize,
        teachingMessage: this.getTeachingMessage('bluff'),
      };
    }

    if (betToCall === 0) {
      return {
        action: 'check',
        teachingMessage: this.getTeachingMessage('weakHand'),
      };
    }

    // Hard mode: occasionally bluff-call with weak hands
    if (isHard && shouldBluff && betToCall < chips * 0.15 && Math.random() < 0.3) {
      return {
        action: 'call',
        amount: betToCall,
        teachingMessage: this.getTeachingMessage('potOdds'),
      };
    }

    // Only call with weak hand if pot odds are great
    if (potOdds < 0.15 && betToCall < chips * 0.05) {
      return {
        action: 'call',
        amount: betToCall,
        teachingMessage: this.getTeachingMessage('potOdds'),
      };
    }

    return {
      action: 'fold',
      teachingMessage: this.getTeachingMessage('fold'),
    };
  }

  private getAggressiveness(): number {
    switch (this.difficulty) {
      case 'easy':
        return 0.5 + Math.random() * 0.3;
      case 'medium':
        return 0.7 + Math.random() * 0.4;
      case 'hard':
        return 1.2 + Math.random() * 0.8; // Much more aggressive (1.2-2.0)
    }
  }

  private getBluffChance(): number {
    switch (this.difficulty) {
      case 'easy':
        return 0.05;
      case 'medium':
        return 0.15;
      case 'hard':
        return 0.40; // 40% bluff chance - very aggressive
    }
  }

  private getTeachingMessage(context: string): string {
    const messages = {
      en: {
        strongPreFlop: "I have a strong starting hand. Let's see how this develops.",
        goodHand: "This is a playable hand. I'll stay in.",
        mediumHand: "My hand has potential. I'll play carefully.",
        weakHand: "This hand is weak. I need to be cautious.",
        strongHand: "I've made a strong hand! Time to build the pot.",
        calling: "The pot odds make this call worthwhile.",
        raising: "I'm raising to build the pot and pressure you.",
        bluff: "Sometimes you need to take risks. I'm betting big!",
        fold: "This hand isn't worth continuing. I fold.",
        potOdds: "The pot odds are good enough to call here.",
      },
      es: {
        strongPreFlop: "Tengo una mano inicial fuerte. Veamos cómo se desarrolla.",
        goodHand: "Esta es una mano jugable. Me quedo.",
        mediumHand: "Mi mano tiene potencial. Jugaré con cuidado.",
        weakHand: "Esta mano es débil. Debo ser cauteloso.",
        strongHand: "¡He formado una mano fuerte! Hora de construir el bote.",
        calling: "Las probabilidades del bote hacen que valga la pena igualar.",
        raising: "Estoy subiendo para construir el bote y presionarte.",
        bluff: "A veces hay que arriesgarse. ¡Apuesto grande!",
        fold: "Esta mano no vale la pena continuar. Me retiro.",
        potOdds: "Las probabilidades del bote son suficientes para igualar aquí.",
      },
    };

    return messages[this.language][context as keyof typeof messages.en] || '';
  }
}
