import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Puffs } from "@arwes/react-bgs";
import { Animator } from "@arwes/react-animator";
import StyledWindow from "../common/StyledWindow";
import Link from "../common/Link";

import FiveOh from "../FiveOh";

import useStyles from "./App.styles";

/**
 *
 * @param param parameter to set in the query string
 * @param slug value to set in the query string
 */
const setQueryParam = (param: string | null, slug: string | null = null) => {
  const { pathname } = window.location;

  const slugQuery = slug ? `&slug=${slug}` : "";
  const newQuery = param ? `?type=${param}${slugQuery}` : "";
  const newPath = `${pathname}${newQuery}`;

  window.history.pushState({ type: param, slug }, document.title, newPath);
};

/**
 * The main control app. Controls which view is visible as well as having the states and setters
 */
const App = (): JSX.Element => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const setModal = useCallback(
    (
      modalType: string | null,
      slug: string | null,
      popstateEvent?: boolean
    ) => {
      switch (modalType) {
        // case "deck":
        //   setActiveDeck(decks[slug as DeckId]);
        //   if (!popstateEvent) {
        //     setQueryParam("deck", slug);
        //   }
        //   break;
        default:
          if (!popstateEvent) {
            setQueryParam(null, null);
          }
      }

      setActiveModal(modalType);
    },
    []
  );

  const classes = useStyles();

  /**
   * catches the browser navigation event and sets the slug
   */
  const onNavigate = useCallback(
    (e: PopStateEvent) => {
      const type = e.state?.type;
      const slug = e.state?.slug;

      if (type) {
        setModal(type, slug || null, true);
      } else {
        setModal(null, null, true);
      }
    },
    [setModal]
  );

  /**
   * on load, this takes query params, parses them, and sets appropriate states
   */
  useEffect(() => {
    const query: { [param: string]: string } = {};

    window.location.search
      .slice(1)
      .split("&")
      .forEach((q) => {
        const paramPair = q.split("=");
        const [key, value] = paramPair;
        query[key] = value;
      });

    onNavigate({ state: query } as PopStateEvent);

    window.addEventListener("popstate", onNavigate);

    return () => {
      window.removeEventListener("popstate", onNavigate);
    };
  }, []);

  return (
    <>
      <div className={classes.backgroundWrapper}>
        <Animator active duration={{ interval: 2 }}>
          <Puffs color="hsl(300deg 83% 53%)" quantity={20} />
        </Animator>
      </div>
      <StyledWindow className={classes.titleWindow}>
        <h3>
          <b>
            <Link onClick={() => setModal(null, null)}>5-0.knoblau.ch</Link>
          </b>
        </h3>
        <h4>
          Brought to you by
        </h4>
        <h4>
          Team Crossfit Meat Factory
        </h4>
      </StyledWindow>
      <FiveOh setModal={setModal}/>
    </>
  );
};

export default App;
