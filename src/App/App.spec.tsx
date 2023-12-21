import React from "react";
import { render } from "@testing-library/react";

import App from "./App";

describe("test test", () => {
  it("should", () => {
    const { queryByText } = render(<App />);

    expect(queryByText("hi!")).not.toBe(null);
  });
});
