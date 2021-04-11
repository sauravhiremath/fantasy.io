import { useEffect, useState, useRef } from "react";
import ReactRough, { Rectangle } from "react-rough";
import "quickdraw-component/quickdraw-component";

function Playground({ objects }) {
  return objects.map((obj, index) => {
    let size = 100;
    const isNear =
      containSome(
        ["big", "near", "close", "closeby", "nearby", "huge", "nearme"],
        obj.properties
      ) ||
      ["big", "near", "close", "closeby", "nearby", "huge", "nearme"].includes(
        obj.position
      );

    const isFar =
      containSome(["small", "far", "faraway"], obj.properties) ||
      ["small", "far", "faraway"].includes(obj.position);

    if (isFar) {
      size = 50;
    } else if (isNear) {
      size = 200;
    }

    return obj.lemmas.map((lemma, secIndex) => (
      <quick-draw
        category={lemma}
        key="AIzaSyC0U3yLy_m6u7aOMi9YJL2w1vWG4oI5mj0"
        animate={true}
        time={1500}
        width={size - 10 * secIndex}
        height={size - 10 * secIndex}
        x={20 * (10 * (index + 1) + 10 * secIndex)}
        y={20 * (2 * (index + 1))}
      />
    ));
  });
}

function containSome(needles, haystack) {
  return needles.some(function (val) {
    return haystack.indexOf(val) !== -1;
  });
}

export default Playground;
