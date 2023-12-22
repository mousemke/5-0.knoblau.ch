import React, { useCallback, useEffect, useMemo, useState } from "react";
import RowLink from "../common/RowLink";
import Separator from "../common/Separator";
import ContentWindow from "../common/ContentWindow";
import { FiveOhCardTypes } from "./FiveOh.types";

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
const dedupeLists = (decks: FiveOhApiDeckLists): FiveOhDeckLists =>
  decks.map((deck: FiveOhApiDeckList) => ({
    main: sortBoard(deck.main_deck),
    sideboard: sortBoard(deck.sideboard_deck),
    player: deck.player,
    instanceId: deck.instance_id,
    loginId: deck.loginid,
    loginplayeventcourseId: deck.loginplayeventcourseid,
    wins: Number(deck.wins.wins),
    losses: Number(deck.wins.losses)
  }));

  /**
 *
 * @param recipes
 * @param filter
 * @returns
 */
const filterByString = (decks: FiveOhDeckLists, filter: string) => {
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

    const decks = localStorage.getItem(`${date}-decks`);
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
  const { setPreviewImage, filter } = props;

  const [decksArray, setDecksArray] = useState<FiveOhDeckLists>([]);
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
          localStorage.setItem(`${date}-decks`, JSON.stringify(decksObj[date]));
        });

        setDecksArray(Object.values(decksObj).flat())
      });
  }, []);

  /**
   *
   */
  const visibleDecks = useMemo(() =>
    filter.length !== 0 ?
      filterByString(decksArray, filter) :
       decksArray,
    [filter, decksArray]
  );

  return (
    <>
      <ContentWindow className={classes.contentWindow}>
        {visibleDecks.length} decks{filter.length !== 0 ? ` (filtered by "${filter}")` : ""}
      </ContentWindow>
      {visibleDecks.length !== 0 ? (
        <>
          {visibleDecks.map((deck: FiveOhDeckList, i: number) => {
            const date = deck.instanceId.split("_")[1];

            return (
              <ContentWindow key={i} className={classes.contentWindow}>
                <a id={deck.player}>
                  <h3>{deck.player} ({deck.wins}-{deck.losses})</h3>
                </a>
                <h4>{date}</h4>
                <Separator className={classes.seperator} />
                {
                  Object.keys(deck.main.sorted).sort().map((type: string, t: number) => (
                    <div className={classes.cardType} key={t}>
                      <div className={classes.cardTypeTitle}>
                        {FiveOhCardTypes[type as FiveOhCardType] || type}
                      </div>
                      <div>
                        {deck.main.sorted[type].map((card: FiveOhCard, c: number) => (
                          <RowLink
                            className={classes.cardLink}
                            key={c}
                            target="_blank"
                            onHover={loadImage(card)}
                            href={`https://scryfall.com/search?q=!"${card.card_name}"`}
                          >
                            <span>{card.qty}</span>
                            <span className={classes.cardName}>{card.card_name}</span>
                          </RowLink>
                        ))}
                      </div>
                    </div>
                  ))
                }
                <div className={classes.cardCount}>{deck.main.count} cards</div>
                <Separator className={classes.seperator} />
                <h4>Sideboard ({deck.sideboard.count})</h4>
                {
                  deck.sideboard.allCards.map((card: FiveOhCard, c: number) => {
                    return (
                      <RowLink
                        className={classes.cardLink}
                        key={c}
                        target="_blank"
                        onHover={loadImage(card)}
                        href={`https://scryfall.com/search?q=!"${card.card_name}"`}
                      >
                        <span>{card.qty}</span>
                        <span className={classes.cardName}>{card.card_name}</span>
                      </RowLink>
                    );
                  })
                }
              </ContentWindow>
            );
          })}
        </>) : <ContentWindow>{filter.length !== 0 ? "No results found" : "Loading..."}</ContentWindow>}
    </>
  );
};

export default FiveOh;
