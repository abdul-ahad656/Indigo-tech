import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";
import "./styles.css";

function Root() {
  const [loading, setLoading] = React.useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className={loading ? "app-shell is-loading" : "app-shell"} aria-hidden={loading}>
        <App />
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
