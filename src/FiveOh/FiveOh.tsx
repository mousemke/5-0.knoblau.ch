import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import HeaderWindow from "../common/HeaderWindow";
import { filterByArchetype, getArchetype } from "./filterByArchetype";
import OneDeck from "../OneDeck";

import config from "../../package.json"

import useStyles from "./FiveOh.styles";

import type {
  FiveOhDeckList,
  FiveOhDeckLists,
  FiveOhApiDeckList,
  FiveOhApiDeckLists,
  FiveOhApiData,
  FiveOhProps,
  FiveOhCard,
  FiveOhBoard,
  FiveOhApiCard,
  FiveOhCardType
} from "./FiveOh.types";

const NO_CARD_TYPE = "Other";
const DAYS_TO_DISPLAY = 7;

/**
 *
 * @param board
 * @returns
 */
const sortBoard = (board: FiveOhApiCard[]): FiveOhBoard => {
  const dedupedBoard: {[key: string]: FiveOhCard} = {};

  board.forEach((card: FiveOhApiCard) => {
    const {
      card_attributes,
      qty
    } = card;

    const {
      card_name,
      card_type,
      rarity
    } = card_attributes;

    const formattedCard: FiveOhCard = {
      card_name,
      rarity,
      qty: Number(qty),
      card_type: (card_type || NO_CARD_TYPE).trim() as FiveOhCardType,
    };

    const cardName = formattedCard.card_name;

    if (dedupedBoard[cardName]) {
      dedupedBoard[cardName].qty = dedupedBoard[cardName].qty + formattedCard.qty;
    } else {
      dedupedBoard[cardName] = formattedCard;
    }
  });

  const dedupedBoardArray: FiveOhCard[] = Object.values(dedupedBoard)
  const sortedBoard: { [key: string]: FiveOhCard[]; } = {};

  dedupedBoardArray.forEach((card: FiveOhCard) => {
    if (sortedBoard[card.card_type]) {
      sortedBoard[card.card_type].push(card);
    } else {
      sortedBoard[card.card_type] = [card];
    }
  });
  const count = dedupedBoardArray.reduce((prev, curr) => prev + curr.qty, 0);

  return { allCards: dedupedBoardArray, sorted: sortedBoard, count };
}

/**
 *
 * @param decks
 * @returns
 */
const dedupeLists = async (decks: FiveOhApiDeckLists): Promise<FiveOhDeckLists> =>
  decks.map((deck: FiveOhApiDeckList) => {
    const newDeckObj = {
      main: sortBoard(deck.main_deck),
      sideboard: sortBoard(deck.sideboard_deck),
      player: deck.player,
      instanceId: deck.instance_id,
      wins: Number(deck.wins.wins),
      losses: Number(deck.wins.losses),
      archetype: ""
    };

    newDeckObj.archetype = getArchetype(newDeckObj);

    return newDeckObj;
  });

  /**
 *
 * @param recipes
 * @param filter
 * @returns
 */
const filterByString = (decks: FiveOhDeckLists, filter: string) => {
  if (filter.length === 0) {
    return decks;
  }

  const filteredDecks: FiveOhDeckLists = [];

  decks.forEach((d) => {
    const { main, sideboard, player } = d;

    if (
      player.toLowerCase().includes(filter) ||
      main.allCards.some((c) => c.card_name.toLowerCase().includes(filter)) ||
      sideboard.allCards.some((c) => c.card_name.toLowerCase().includes(filter))
    ) {
      filteredDecks.push(d);
    }
  });

  return filteredDecks;
};

/**
 *
 * @param date
 * @returns
 */
const formatDate = (date: Date) => {
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

  return `${year}-${month}-${day}`;
}

/**
 *
 * @param date
 * @param decksArray
 * @param setDecksArray
 */
const retrieveDecklistsForDate = (
  date: string,
): Promise<{[key: string]: FiveOhDeckLists}> => {
  return new Promise((resolve, reject) => {

    const decks = localStorage.getItem(`${date}-decks-${config.version}`);
    if (decks) {
      resolve({[date]: JSON.parse(decks)});
    } else {
      fetch(`https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?publish_date=${date}&name=Modern%20League&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists`)
        .then((res: any) => res.json())
        .then((res: FiveOhApiData) => dedupeLists(res.league_cover_page_list[0].decklists))
        .then((decks: FiveOhDeckLists) => resolve({[date]: decks}));
    }
  });
}

/**
 * The list of all 5-0 decks for DAYS_TO_DISPLAY days
 */
const FiveOh = (props: FiveOhProps): JSX.Element => {
  const { viewByArchetype, setPreviewImage, filter } = props;

  const [decksArray, setDecksArray] = useState<FiveOhDeckLists>([]);
  const [decksByArchetype, setDecksByArchetype] = useState<{[key: string]: FiveOhDeckLists}>({});
  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);

  const classes = useStyles();

  let imageTimeout: NodeJS.Timeout | null = null;

  const loadImage = useCallback((card: FiveOhCard) => () => {
    if (imageTimeout) {
      clearTimeout(imageTimeout);
    }
    imageTimeout = setTimeout(() => setPreviewImage(card.card_name), 1000);
  }, []);

  /**
   *
   */
  useEffect(() => {
    const dateObj = new Date();
    const datesArray: string[] = [];

    for (let i = 0; i < DAYS_TO_DISPLAY; i++) {
      datesArray.push(formatDate(dateObj));
      dateObj.setDate(dateObj.getDate() - 1);
    }

    Promise.all(datesArray.map((date: string): Promise<{[key: string]: FiveOhDeckLists}> =>
        retrieveDecklistsForDate(date))
      )
      .then((decks: {[key: string]: FiveOhDeckLists}[]) => {
        localStorage.clear();

        const decksObj = decks.reduce((prev, curr) => ({...prev, ...curr}), {});
        Object.keys(decksObj).forEach((date) => {
          localStorage.setItem(`${date}-decks-${config.version}`, JSON.stringify(decksObj[date]));
        });

        const allTheDecks = Object.values(decksObj).flat();

        setDecksArray(allTheDecks);
        setDecksByArchetype(filterByArchetype(allTheDecks));
      });
  }, []);

  /**
   *
   */
  const visibleDecks = useMemo(() =>
    filterByString(decksArray, filter),
    [filter, decksArray]
  );

  const setActiveArchetypeHandler = useCallback((archetype: string) => () =>
  activeArchetype === archetype ? setActiveArchetype(null) : setActiveArchetype(archetype),
    [activeArchetype]
  );

  return (
    <>
      {decksArray.length !== 0 ? (
        <HeaderWindow className={classes.contentWindow}>
          {visibleDecks.length} decks{filter.length !== 0 ? ` (filtered by "${filter}")` : ""}
        </HeaderWindow>
      ) : <HeaderWindow>Loading...</HeaderWindow>}
      {viewByArchetype === false ? (
        visibleDecks.map((deck: FiveOhDeckList, i: number) => (
          <OneDeck key={i} deck={deck} loadImage={loadImage} />
        ))
      ) : (
        Object.keys(decksByArchetype).sort().map((archetype: string, i: number) => {
          const visibleArchetypeDecks = filterByString(decksByArchetype[archetype], filter);

          return visibleArchetypeDecks.length > 0 ? (
            <Fragment key={i}>
              <HeaderWindow onClick={setActiveArchetypeHandler(archetype)}>
                {archetype} - ({visibleArchetypeDecks.length} decks)
              </HeaderWindow>
              {activeArchetype === archetype && visibleArchetypeDecks.map((deck: FiveOhDeckList, i: number) => (
                <OneDeck key={i} deck={deck} loadImage={loadImage} />
              ))}
            </Fragment>
          ) : null;
        })
      )}
    </>
  );
};

export default FiveOh;
