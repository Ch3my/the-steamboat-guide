import type { Card, HandEvaluation, HandRank } from '../types/poker';
import { getRankValue } from './deck';

const HAND_RANK_VALUES: Record<HandRank, number> = {
  'high-card': 1,
  'pair': 2,
  'two-pair': 3,
  'three-of-a-kind': 4,
  'straight': 5,
  'flush': 6,
  'full-house': 7,
  'four-of-a-kind': 8,
  'straight-flush': 9,
  'royal-flush': 10,
};

export const evaluateHand = (hand: Card[], communityCards: Card[]): HandEvaluation => {
  const allCards = [...hand, ...communityCards];
  const bestHand = findBestHand(allCards);
  return bestHand;
};

const findBestHand = (cards: Card[]): HandEvaluation => {
  if (cards.length < 5) {
    return evaluatePartialHand(cards);
  }

  let bestEvaluation: HandEvaluation | null = null;

  // Try all 5-card combinations
  const combinations = getCombinations(cards, 5);
  for (const combo of combinations) {
    const evaluation = evaluateFiveCards(combo);
    if (!bestEvaluation || compareHands(evaluation, bestEvaluation) > 0) {
      bestEvaluation = evaluation;
    }
  }

  return bestEvaluation!;
};

const evaluatePartialHand = (cards: Card[]): HandEvaluation => {
  if (cards.length === 0) {
    return {
      rank: 'high-card',
      value: 0,
      cards: [],
      description: 'No cards',
      kickers: [],
    };
  }

  const sortedCards = [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
  const rankCounts = countRanks(sortedCards);

  // Check for pairs in hand
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count === 2) {
      return {
        rank: 'pair',
        value: HAND_RANK_VALUES['pair'] * 1000000 + getRankValue(rank as any),
        cards: sortedCards.filter(c => c.rank === rank),
        description: `Pair of ${rank}s`,
        kickers: sortedCards.filter(c => c.rank !== rank).map(c => getRankValue(c.rank)),
      };
    }
  }

  return {
    rank: 'high-card',
    value: HAND_RANK_VALUES['high-card'] * 1000000 + getRankValue(sortedCards[0].rank),
    cards: [sortedCards[0]],
    description: `${sortedCards[0].rank} high`,
    kickers: sortedCards.slice(1).map(c => getRankValue(c.rank)),
  };
};

const evaluateFiveCards = (cards: Card[]): HandEvaluation => {
  const sorted = [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));

  const isFlush = checkFlush(sorted);
  const isStraight = checkStraight(sorted);
  const rankCounts = countRanks(sorted);

  // Royal Flush
  if (isFlush && isStraight && getRankValue(sorted[0].rank) === 14) {
    return {
      rank: 'royal-flush',
      value: HAND_RANK_VALUES['royal-flush'] * 1000000,
      cards: sorted,
      description: 'Royal Flush',
      kickers: [],
    };
  }

  // Straight Flush
  if (isFlush && isStraight) {
    return {
      rank: 'straight-flush',
      value: HAND_RANK_VALUES['straight-flush'] * 1000000 + getRankValue(sorted[0].rank),
      cards: sorted,
      description: `Straight Flush, ${sorted[0].rank} high`,
      kickers: [],
    };
  }

  // Four of a Kind
  const fourOfAKind = Object.entries(rankCounts).find(([_, count]) => count === 4);
  if (fourOfAKind) {
    const [rank] = fourOfAKind;
    const kicker = sorted.find(c => c.rank !== rank)!;
    return {
      rank: 'four-of-a-kind',
      value: HAND_RANK_VALUES['four-of-a-kind'] * 1000000 + getRankValue(rank as any) * 100 + getRankValue(kicker.rank),
      cards: sorted.filter(c => c.rank === rank),
      description: `Four ${rank}s`,
      kickers: [getRankValue(kicker.rank)],
    };
  }

  // Full House
  const threeOfAKind = Object.entries(rankCounts).find(([_, count]) => count === 3);
  const pair = Object.entries(rankCounts).find(([_, count]) => count === 2);
  if (threeOfAKind && pair) {
    const [threeRank] = threeOfAKind;
    const [pairRank] = pair;
    return {
      rank: 'full-house',
      value: HAND_RANK_VALUES['full-house'] * 1000000 + getRankValue(threeRank as any) * 100 + getRankValue(pairRank as any),
      cards: sorted,
      description: `${threeRank}s full of ${pairRank}s`,
      kickers: [],
    };
  }

  // Flush
  if (isFlush) {
    return {
      rank: 'flush',
      value: HAND_RANK_VALUES['flush'] * 1000000 + sorted.reduce((acc, card, i) => acc + getRankValue(card.rank) * Math.pow(100, 4 - i), 0),
      cards: sorted,
      description: `${sorted[0].suit} Flush`,
      kickers: sorted.map(c => getRankValue(c.rank)),
    };
  }

  // Straight
  if (isStraight) {
    return {
      rank: 'straight',
      value: HAND_RANK_VALUES['straight'] * 1000000 + getRankValue(sorted[0].rank),
      cards: sorted,
      description: `Straight, ${sorted[0].rank} high`,
      kickers: [],
    };
  }

  // Three of a Kind
  if (threeOfAKind) {
    const [rank] = threeOfAKind;
    const kickers = sorted.filter(c => c.rank !== rank);
    return {
      rank: 'three-of-a-kind',
      value: HAND_RANK_VALUES['three-of-a-kind'] * 1000000 + getRankValue(rank as any) * 10000 + kickers.reduce((acc, c) => acc * 100 + getRankValue(c.rank), 0),
      cards: sorted.filter(c => c.rank === rank),
      description: `Three ${rank}s`,
      kickers: kickers.map(c => getRankValue(c.rank)),
    };
  }

  // Two Pair
  const pairs = Object.entries(rankCounts).filter(([_, count]) => count === 2);
  if (pairs.length === 2) {
    const [pair1Rank] = pairs[0];
    const [pair2Rank] = pairs[1];
    const highPair = getRankValue(pair1Rank as any) > getRankValue(pair2Rank as any) ? pair1Rank : pair2Rank;
    const lowPair = highPair === pair1Rank ? pair2Rank : pair1Rank;
    const kicker = sorted.find(c => c.rank !== pair1Rank && c.rank !== pair2Rank)!;
    return {
      rank: 'two-pair',
      value: HAND_RANK_VALUES['two-pair'] * 1000000 + getRankValue(highPair as any) * 10000 + getRankValue(lowPair as any) * 100 + getRankValue(kicker.rank),
      cards: sorted.filter(c => c.rank === pair1Rank || c.rank === pair2Rank),
      description: `${highPair}s and ${lowPair}s`,
      kickers: [getRankValue(kicker.rank)],
    };
  }

  // One Pair
  if (pair) {
    const [rank] = pair;
    const kickers = sorted.filter(c => c.rank !== rank);
    return {
      rank: 'pair',
      value: HAND_RANK_VALUES['pair'] * 1000000 + getRankValue(rank as any) * 10000 + kickers.reduce((acc, c) => acc * 100 + getRankValue(c.rank), 0),
      cards: sorted.filter(c => c.rank === rank),
      description: `Pair of ${rank}s`,
      kickers: kickers.map(c => getRankValue(c.rank)),
    };
  }

  // High Card
  return {
    rank: 'high-card',
    value: HAND_RANK_VALUES['high-card'] * 1000000 + sorted.reduce((acc, card, i) => acc + getRankValue(card.rank) * Math.pow(100, 4 - i), 0),
    cards: [sorted[0]],
    description: `${sorted[0].rank} high`,
    kickers: sorted.slice(1).map(c => getRankValue(c.rank)),
  };
};

const checkFlush = (cards: Card[]): boolean => {
  return cards.every(card => card.suit === cards[0].suit);
};

const checkStraight = (cards: Card[]): boolean => {
  const values = cards.map(c => getRankValue(c.rank)).sort((a, b) => b - a);

  // Check for normal straight
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] - values[i + 1] !== 1) {
      // Check for Ace-low straight (A-2-3-4-5)
      if (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
        return true;
      }
      return false;
    }
  }
  return true;
};

const countRanks = (cards: Card[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  }
  return counts;
};

const getCombinations = <T,>(array: T[], size: number): T[][] => {
  if (size > array.length) return [];
  if (size === array.length) return [array];
  if (size === 1) return array.map(item => [item]);

  const combinations: T[][] = [];
  for (let i = 0; i <= array.length - size; i++) {
    const head = array[i];
    const tailCombinations = getCombinations(array.slice(i + 1), size - 1);
    for (const tail of tailCombinations) {
      combinations.push([head, ...tail]);
    }
  }
  return combinations;
};

export const compareHands = (hand1: HandEvaluation, hand2: HandEvaluation): number => {
  if (hand1.value > hand2.value) return 1;
  if (hand1.value < hand2.value) return -1;
  return 0;
};

export const getHandStrength = (evaluation: HandEvaluation): 'weak' | 'medium' | 'strong' => {
  const rankValue = HAND_RANK_VALUES[evaluation.rank];
  if (rankValue >= 7) return 'strong'; // Full house or better
  if (rankValue >= 4) return 'medium'; // Three of a kind or better
  return 'weak';
};
