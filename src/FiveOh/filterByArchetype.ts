import { archetypeSignposts } from "./archetypeSignposts";

import type {
  FiveOhDeckList,
  FiveOhDeckLists,
} from "./FiveOh.types";

interface DecksByArchetype {
  [key: string]: FiveOhDeckLists
}

const NO_ARCHETYPE = "Other";

export const getArchetype = (deck: FiveOhDeckList): string => {
    const allCards: string[] = deck.main.allCards.concat(deck.sideboard.allCards).map((card) => card.card_name.toLowerCase());
    let deckArchetype: string = NO_ARCHETYPE;

    Object.keys(archetypeSignposts).every((archetype: string) => {
      const signpostKey = archetype as keyof typeof archetypeSignposts;

      const signposts = archetypeSignposts[signpostKey];

      if (
        signposts.every((card: string | undefined) => card && allCards.includes(card))
      ) {
        deckArchetype = signpostKey;

        return false;
      }

      return true;
    });

    return deckArchetype;
};

export const filterByArchetype = (deckLists: FiveOhDeckLists): DecksByArchetype => {
  const decksByArchetype: DecksByArchetype = {
    [NO_ARCHETYPE]: [] as FiveOhDeckLists,
  };

  deckLists.forEach((deck: FiveOhDeckList) => {
    const allCards: string[] = deck.main.allCards.concat(deck.sideboard.allCards).map((card) => card.card_name.toLowerCase());
    let archetypeFound = false;

    Object.keys(archetypeSignposts).forEach((archetype: string) => {
      const signpostKey = archetype as keyof typeof archetypeSignposts;

      const signposts = archetypeSignposts[signpostKey];

      if (
        signposts.every((card: string | undefined) => card && allCards.includes(card))
      ) {
        if (decksByArchetype[signpostKey]) {
          decksByArchetype[signpostKey].push(deck);
        } else {
          decksByArchetype[signpostKey] = [deck];
        }
        archetypeFound = true;
      }
    });

    if (archetypeFound === false) {
      decksByArchetype[NO_ARCHETYPE].push(deck);
    }
  });

  return decksByArchetype;
};
