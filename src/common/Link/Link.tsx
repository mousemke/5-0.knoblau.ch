import React, { useMemo } from "react";

import useStyles from "./Link.styles";

import type { LinkProps } from "./Link.types";

const Link = (props: LinkProps): JSX.Element => {
  const { children, className = "", href, id, onClick, target } = props;

  const classes = useStyles();

  const combinedClasses = useMemo(
    () =>
      href
        ? `${classes.link} ${className}`.trim()
        : `${classes.link} ${classes.buttonAsLink} ${className}`.trim(),
    [classes.link, className, href]
  );

  const options = {
    className: combinedClasses,
    href,
    id,
    onClick,
    role: href ? undefined : "button",
    target
  };

  if (!href) {
    return <button {...options}>{children}</button>;
  }

  return <a {...options}>{children}</a>;
};

export default Link;
