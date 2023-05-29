import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBridge } from "@linkbridge/web";
import type { AppBridge } from "@linkbridge/example-native";

const bridge = createBridge<AppBridge>();

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // console.log(bridge);
    // if (count === 1) {
    //   alert(JSON.stringify(bridge));
    // }
    if (count === 2) {
      bridge.openInAppBrowser().then((v) => alert(JSON.stringify(v)));
    }
    if (count === 3) {
      bridge.openInAppBrowser2("안뇽").then((v) => alert(JSON.stringify(v)));
    }
    console.log(count);
  }, [count]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
