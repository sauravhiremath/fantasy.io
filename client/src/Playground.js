import { useEffect, useState, useRef } from "react";
import ReactRough, { Rectangle } from "react-rough";
import "quickdraw-component/quickdraw-component";

function Playground({ objects }) {
  return objects.map((obj) => {
    const size = obj.properites.indexOf("big") !== -1 ? 200 : 100;
    return (
      <quick-draw
        category={obj.lemma}
        key="AIzaSyC0U3yLy_m6u7aOMi9YJL2w1vWG4oI5mj0"
        animate={true}
        time={1500}
        width={size}
        height={size}
        x={20}
        y={20}
      />
    );
  });
}

export default Playground;
