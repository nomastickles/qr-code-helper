import React from "react";
import { useAppState } from "./hooks/useAppState";

function App() {
  const { appStep } = useAppState();
  const init = appStep["INIT"];

  React.useEffect(() => {
    console.log("init", init);
  }, [init]);

  return <div></div>; // no-op
}

export default App;
