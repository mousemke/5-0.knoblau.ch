import React from "react";
import StyledWindow from "../StyledWindow";
import useStyles from "./ContentWindow.styles";

import type { ContentWindowProps } from "./ContentWindow.types";

/**
 * The list of all decks
 */
const ContentWindow = (props: ContentWindowProps): JSX.Element => {
  const { children, className } = props;

  const classes = useStyles();

  return (
    <StyledWindow className={`${classes.wrapperWindow} ${className || ""}`}>
      {children}
    </StyledWindow>
  );
};

export default ContentWindow;
