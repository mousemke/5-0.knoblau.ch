import React, { useMemo } from "react";

import useStyles from "./RowLink.styles";

import type { RowLinkProps } from "./RowLink.types";

const RowLink = (props: RowLinkProps): JSX.Element => {
  const { children, className = "", href, onClick, target } = props;

  const classes = useStyles();

  const combinedClasses = useMemo(
    () => `${classes.link} ${className}`.trim(),
    [classes.link, className]
  );

  const options = {
    className: combinedClasses,
    href,
    onClick,
    role: href ? undefined : "button",
    target
  };

  return <a {...options}>{children}</a>;
};

export default RowLink;
