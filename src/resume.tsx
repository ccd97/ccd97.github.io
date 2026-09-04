import React from "react";
import ReactDOM from "react-dom/client";
import { ResumePage } from "@/pages/ResumePage";
import "@/index.css";

declare global {
  interface Window {
    __resumeBooted?: boolean;
  }
}

window.__resumeBooted = true;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ResumePage />
  </React.StrictMode>,
);
