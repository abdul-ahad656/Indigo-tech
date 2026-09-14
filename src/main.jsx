import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";
import "./styles.css";

function Root() {
  const [loading, setLoading] = React.useState(true);

  return (
    <>
      <div
        className={`app-shell${loading ? " is-loading preloader-active" : ""}`}
        aria-hidden={loading || undefined}
      >
        <App />
      </div>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
    </>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
