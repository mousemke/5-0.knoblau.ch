import React, { useEffect, useState } from "react";
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

/**
 *
 * @param board
 * @returns
 */
const sortBoard = (board: FiveOhApiCard[]): FiveOhBoard => {
  const dedupedBoard: {[key: string]: FiveOhCard} = {};

  board.forEach((card: FiveOhApiCard) => {
    const { card_attributes, ...filteredCard } = card;
    const formattedCard: FiveOhCard = {
      ...filteredCard,
      qty: Number(filteredCard.qty),
      ...card.card_attributes,
      card_type: (card.card_attributes.card_type || NO_CARD_TYPE).trim() as FiveOhCardType,
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
 * The list of all 5-0 decks
 */
const FiveOh = (props: FiveOhProps): JSX.Element => {
  // const { setModal } = props;
  const [decksArray, setDecksArray] = useState<FiveOhDeckLists>([]);
  const classes = useStyles();

  useEffect(() => {
    const date = localStorage.getItem("decks_retrieval_date");
    const now = Date.now();
    const oneDay = 1000 * 60 * 60 * 24;
    const oneDayAgo = now - oneDay;

    if (date && Number(date) > oneDayAgo) {
      const decks = localStorage.getItem("decks");
      if (decks) {
        setDecksArray(JSON.parse(decks));
      }
    } else {
      fetch("https://census.daybreakgames.com/s:dgc/get/mtgo:v1/league_cover_page?instance_id=7787_2023-12-21&c:join=league_decklist_by_id^on:instance_id^to:instance_id^rawList:1^inject_at:decklists")
      .then((res: any) => res.json())
      .then((res: FiveOhApiData) => dedupeLists(res.league_cover_page_list[0].decklists))
      .then((decks: FiveOhDeckLists) => {
        setDecksArray(decks);

        localStorage.setItem("decks", JSON.stringify(decks));
        localStorage.setItem("decks_retrieval_date", Date.now().toString());
      });
    }
  }, []);

  // const onClick = useCallback(
  //   (deck: Deck) => () => setModal("deck", deck.slug),
  //   []
  // );

  return (
    <>
      {decksArray.length !== 0 ? (
        <>
          {decksArray.map((deck: FiveOhDeckList, i: number) => {
            const date = deck.instanceId.split("_")[1];

            return (
              <ContentWindow key={i} className={classes.contentWindow}>
                <h3>{deck.player} ({deck.wins}-{deck.losses})</h3>
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
        </>) : <ContentWindow>Loading...</ContentWindow>}
    </>
  );
};

export default FiveOh;
