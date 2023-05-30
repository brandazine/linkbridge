import { useEffect, useState } from "react";
import "./App.css";
import { createBridge } from "@linkbridge/web";
import type { AppBridge } from "@linkbridge/example-native";

const bridge = createBridge<AppBridge>();

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    bridge.getName().then(setMessage);
  }, []);

  return (
    <div>
      <h1>{message}</h1>

      <button
        onClick={() => {
          bridge.openInAppBrowser("https://github.com/brandazine/linkbridge");
        }}
      >
        open InAppBrowser
      </button>
    </div>
  );
}

export default App;
