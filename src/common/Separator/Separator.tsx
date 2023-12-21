import React from "react";

import useStyles from "./Separator.styles";

import type { SeperatorProps } from "./Separator.types";

const separator = ({ className }: SeperatorProps): JSX.Element => {
  const classes = useStyles();

  return <div className={`${classes.separator} ${className || ""}`} />;
};

export default separator;
