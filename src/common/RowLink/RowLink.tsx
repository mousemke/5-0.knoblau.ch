import React, { useMemo } from "react";

import useStyles from "./RowLink.styles";

import type { RowLinkProps } from "./RowLink.types";

const RowLink = (props: RowLinkProps): JSX.Element => {
  const { children, className = "", href, id, onClick, onHover, target } = props;

  const classes = useStyles();

  const combinedClasses = useMemo(
    () => `${classes.link} ${className}`.trim(),
    [classes.link, className]
  );

  const options = {
    className: combinedClasses,
    href,
    onClick,
    onMouseEnter: onHover,
    role: href ? undefined : "button",
    target,
    id
  };

  return <a {...options}>{children}</a>;
};

export default RowLink;
