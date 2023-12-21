
export enum FiveOhCardTypes {
  INSTNT = "Instant",
  LAND = "Land",
  ISCREA = "Creature",
  SORCRY = "Sorcery",
  ENCHMT = "Enchantment",
  ARTFCT = "Artifact",
  PLNWKR = "Planeswalker",
};

export type FiveOhCardType = keyof typeof FiveOhCardTypes;

export interface FiveOhCard {
  card_name: string;
  card_type: FiveOhCardType;
  cardset: string;
  color: string;
  colors: string[];
  cost: string;
  digitalobjectcatalogid: string;
  rarity: string;
  docid: string;
  leaguedeckid: string;
  loginplayeventcourseid: string;
  qty: number;
  sideboard: string;
}

export interface FiveOhBoard {
  allCards: FiveOhCard[];
  sorted: {
    [key: string]: FiveOhCard[];
  };
  count: number;
}

export interface FiveOhDeckList {
  main: FiveOhBoard;
  sideboard: FiveOhBoard;
  player: string;
  instanceId: string;
  loginId: string;
  loginplayeventcourseId: string;
  wins: number;
  losses: number;
}

export type FiveOhDeckLists = FiveOhDeckList[];

export interface FiveOhProps {
  setModal: (modalType: string | null, slug: string | null) => void;
  setPreviewImage: (imageName: string | null) => void;
}

/**
 * api data
 */

export interface FiveOhApiCard {
  "card_attributes": {
    card_name: string;
    card_type: string;
    cardset: string;
    color: string;
    colors: string[];
    cost: string;
    digitalobjectcatalogid: string;
    rarity: string;
  },
  docid: string;
  leaguedeckid: string;
  loginplayeventcourseid: string;
  qty: string;
  sideboard: string;
};

export interface FiveOhApiDeckWins {
  wins: string;
  losses: string;
}

export interface FiveOhApiDeckList {
  instance_id: string;
  loginid: string;
  wins: FiveOhApiDeckWins;
  loginplayeventcourseid: string;
  "main_deck": FiveOhApiCard[];
  player: string;
  "sideboard_deck": FiveOhApiCard[];
};

export type FiveOhApiDeckLists = FiveOhApiDeckList[];

export interface FiveOhApiData {
  "league_cover_page_list": {
    "decklists": FiveOhApiDeckLists;
    instance_id: string;
    name: string;
    playeventid: string;
    publish_date: string;
    site_name: string;
  }[];
  returned: number;
};