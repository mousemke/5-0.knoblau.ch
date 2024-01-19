import React, { useCallback, useEffect, useMemo, useState } from "react";
import RowLink from "../common/RowLink";
import Separator from "../common/Separator";
import ContentWindow from "../common/ContentWindow";
import { FiveOhCardTypes } from "../FiveOh/FiveOh.types";
import { OneDeckProps } from "./OneDeck.types";

import useStyles from "./OneDeck.styles";

import type {
  FiveOhCard,
  FiveOhCardType
} from "../FiveOh/FiveOh.types";


/**
 * a single deck
 */
const OneDeck = (props: OneDeckProps): JSX.Element => {
  const { deck, loadImage } = props;

  const classes = useStyles();

  const date = deck.instanceId.split("_")[1];

  return (
    <ContentWindow className={classes.contentWindow}>
      <a id={deck.player}>
        <h3>{deck.player} - {deck.archetype}</h3>
      </a>
      <h4>{date} ({deck.wins}-{deck.losses})</h4>
      <Separator className={classes.seperator} />
      <div className={classes.mainboardWrapper} >
      {
        Object.keys(deck.main.sorted).sort().map((type: string, t: number) => (
          <div className={classes.cardType} key={t}>
            <div className={classes.cardTypeTitle}>
              {FiveOhCardTypes[type as FiveOhCardType] || type} ({deck.main.sorted[type].reduce((prev, curr) => prev + curr.qty, 0)})
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
      </div>
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
};

export default OneDeck;
