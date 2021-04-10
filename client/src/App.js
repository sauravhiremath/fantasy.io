import "quickdraw-component/quickdraw-component";
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
      <ReactRough
        width={window.innerWidth}
        height={window.innerHeight}
        renderer="canvas"
      >
        <Rectangle
          x={15}
          y={15}
          width={window.innerWidth - 50}
          height={window.innerHeight - 200}
          bowing={2}
          disableMultiStroke
          strokeWidth={5}
          seed={10}
        />
      </ReactRough>
      <quick-draw
        category="apple"
        key="AIzaSyC0U3yLy_m6u7aOMi9YJL2w1vWG4oI5mj0"
        animate={true}
        time={1500}
        width={100}
        height={100}
        x={20}
        y={20}
      />
      <quick-draw
        category="car"
        key="AIzaSyC0U3yLy_m6u7aOMi9YJL2w1vWG4oI5mj0"
        animate={true}
        time={1500}
        width={100}
        height={100}
        x={300}
        y={20}
      />
      <quick-draw
        category="kangaroo"
        key="AIzaSyC0U3yLy_m6u7aOMi9YJL2w1vWG4oI5mj0"
        animate={true}
        time={1500}
        width={100}
        height={100}
        x={20}
        y={300}
      />
    </div>
  );
}

export default App;
