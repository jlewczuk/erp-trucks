import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components";
import { SelectionProvider, ToastProvider, TrucksProvider } from "./contexts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TrucksProvider>
      <ToastProvider>
        <SelectionProvider>
          <App />
        </SelectionProvider>
      </ToastProvider>
    </TrucksProvider>
  </React.StrictMode>,
);
