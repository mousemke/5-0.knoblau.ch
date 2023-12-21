import React from "react";
import { FrameSVGNefrex } from "@arwes/react-frames";
import { Text } from "@arwes/react-text";

import useStyles from "./StyledWindow.styles";

import type { StyledWindowProps } from "./StyledWindow.types";

const StyledWindow = (props: StyledWindowProps): JSX.Element => {
  const { children, className } = props;

  const classes = useStyles();

  return (
    <div className={`${className} ${classes.wrapper}`}>
      <Text as="div">{children}</Text>
      <FrameSVGNefrex className={classes.frame} />
    </div>
  );
};

export default StyledWindow;
