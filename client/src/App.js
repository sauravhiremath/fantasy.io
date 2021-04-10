import { useEffect, useState } from "react";
import ReactRough, { Rectangle } from "react-rough";

function App() {
  const [intents, setIntents] = useState([]);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetch("http://localhost:8080/intent", {
        method: "post",
        body: intents,
      });
      if (data.ok) {
        setElements((v) => [...v, ...intents.set]);
      }
    })();
  }, [intents]);
  return (
    <div className="App">
      <ReactRough width="90vw" height="90vh">
        <Rectangle x={15} y={15} width={500} height={1000} fill="red" />
      </ReactRough>
    </div>
  );
}

export default App;
