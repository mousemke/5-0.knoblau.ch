import React from "react";
import ContentWindow from "../ContentWindow";
import RowLink from "../RowLink";

import type { HeaderWindowProps } from "./HeaderWindow.types";

/**
 *
 */
const HeaderWindow = (props: HeaderWindowProps): JSX.Element => {
  const { onClick, children, className } = props;

  return (
    <ContentWindow className={className}>
    {
      onClick ? (
        <RowLink onClick={onClick}>
          <h3>{children}</h3>
        </RowLink>
      ) : <h3>{children}</h3>
    }
    </ContentWindow>
  );
};

export default HeaderWindow;
