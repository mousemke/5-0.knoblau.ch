import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Puffs } from "@arwes/react-bgs";
import { Animator } from "@arwes/react-animator";
import StyledWindow from "../common/StyledWindow";
import Link from "../common/Link";

import FiveOh from "../FiveOh";
import PreviewCard from "../PreviewCard";

import useStyles from "./App.styles";

/**
 * The main control app. Controls which view is visible as well as having the states and setters
 */
const App = (): JSX.Element => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [viewByArchetype, setViewByArchetype] = useState<boolean>(false);

  const classes = useStyles();

  const changeView = useCallback(() =>
    setViewByArchetype(!viewByArchetype),
    [viewByArchetype]
  );

  return (
    <>
      <div className={classes.backgroundWrapper}>
        <Animator active duration={{ interval: 2 }}>
          <Puffs color="hsl(300deg 83% 53%)" quantity={20} />
        </Animator>
      </div>
      <div className={classes.topBarsWrapper}>
        <div className={classes.topBars}>
          <StyledWindow className={classes.titleWindow}>
            <h3>
              <b>
                5-0.knoblau.ch
              </b>
            </h3>
            <h4>
              Team Crossfit Meat Factory
            </h4>
            <label
              className={classes.accessibiiltyLabel}
              htmlFor={classes.filterInput}
            >
              Filter by Text
            </label>
            <input
              className={classes.filterInput}
              defaultValue={""}
              id={classes.filterInput}
              onChange={(e) => setFilter(e.target.value.toLowerCase())}
              placeholder="Filter by Text"
              type="text"
            />
            <Link className={classes.archetypeSwitchLink} onClick={changeView}>
              View by Archetype (experimental)
            </Link>
          </StyledWindow>
        </div>
      </div>
      {previewImage ? <PreviewCard previewImage={previewImage}/> : null}
      <FiveOh viewByArchetype={viewByArchetype} filter={filter} setPreviewImage={setPreviewImage}/>
    </>
  );
};

export default App;
