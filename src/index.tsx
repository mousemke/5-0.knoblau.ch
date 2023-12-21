import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const { body } = document;

if (body) {
  const rootApp = document.createElement("div");

  body.appendChild(rootApp);
  const root = createRoot(rootApp);

  root.render(<App />);
}
