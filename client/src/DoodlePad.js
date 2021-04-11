import { useEffect, useState } from "react";
import ReactRough, { Rectangle } from "react-rough";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Howl } from "howler";
import "quickdraw-component/quickdraw-component";
import mic from "./mic.png";
import electronic from "./audio/electronic.mp3";
import instrumental from "./audio/instrumental.mp3";
import jazz from "./audio/jazz.mp3";
import lofi from "./audio/lofi.mp3";
import { useRef } from "react";
import Playground from "./Playground";
import Canvas from './Canvas';

const MUSIC_ARRAY = [electronic, instrumental, jazz, lofi];

const getRandomMusic = () => {
  return MUSIC_ARRAY[Math.floor(Math.random() * MUSIC_ARRAY.length)];
};

const Visualizer = ({ bars }) => {
  return bars.map((bar, i) => <span id={`${i + 1}`} style={{ height: bar }} />);
};

function DoodlePad() {
  const [intents, setIntents] = useState([]);
  const [context, setContext] = useState(null);
  const [elements, setElements] = useState([]);
  const [musicId, setMusicId] = useState(false);
  const [seek, setSeek] = useState(0);
  const [currentSong, setCurrentSong] = useState(0);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [bars, setBars] = useState([]);
  const canvasBorderRef = useRef(null);

  const musicInstance = new Howl({
    src: getRandomMusic(),
  });

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true, video: false })
  //     .then((stream) => {
  //       if (stream) {
  //         const context = new (window.AudioContext ||
  //           window.webkitAudioContext)();
  //         const source = context.createMediaStreamSource(stream);
  //         const analyser = context.createAnalyser();
  //         source.connect(analyser);

  //         function renderFrame() {
  //           requestAnimationFrame(renderFrame);
  //           const frequencyData = new Float32Array(256);
  //           analyser.getFloatTimeDomainData(frequencyData);
  //           const bars = [];
  //           for (let i = 0; i < 54; i++) {
  //             const val = Math.abs(frequencyData[i]);
  //             bars.push(`${val * 1000}%`);
  //           }
  //           setBars(bars);
  //         }
  //         renderFrame();
  //       }
  //     });
  // }, []);

  useEffect(() => {
    const canvasEle = canvasBorderRef.current;

    const drawRect = (info, style = {}) => {
      const { x, y, w, h } = info;
      const { borderColor = "black", borderWidth = 2 } = style;

      context.beginPath();
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.rect(x, y, w, h);
      context.stroke();
    };

    if (canvasEle) {
      canvasEle.width = window.innerWidth;
      canvasEle.height = window.innerHeight - 250;

      // get context of the canvas
      const ctx = canvasEle.getContext("2d");
      setContext(ctx);
    }

    if (context) {
      drawRect({
        x: 15,
        y: 15,
        w: window.innerWidth - 50,
        h: window.innerHeight - 300,
      });
    }

    return () => {
      if (canvasEle) {
        console.log("cleaned up canvas");
      }
    };
  }, [context]);

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

  const handleMusicClick = () => {
    if (!musicInstance.playing(musicId)) {
      setMusicId(musicInstance.play());
      musicInstance.seek(seek, musicId);
    } else {
      musicInstance.stop(musicId);
      setSeek(musicInstance.seek(musicId));
    }
    console.log(musicInstance.playing(musicId));
    console.log(musicId);
  };

  return (
    <div className="App">
      <canvas id="canvas" ref={canvasBorderRef} />
      <Canvas />
      {/* <Playground /> */}

      <div className="row">
        <div className="column">
          <h4>
            Use <code>W A S D</code> to move character
          </h4>
          <div className="column" style={{ margin: "auto" }}>
            <div className="row">
              <h5 style={{ alignSelf: "center" }}>Music:</h5>
              <button
                type="button"
                className="nes-btn is-primary"
                style={{
                  marginBottom: "20px",
                  marginLeft: "10px",
                  paddingTop: "0px",
                }}
                onClick={handleMusicClick}
              >
                {musicInstance.playing(musicId) ? "❚❚" : "▶"}
              </button>
            </div>
            <button type="button" className="nes-btn is-error">
              Clear Canvas
            </button>
          </div>
        </div>
        <div className="column-center">
          <div className="voice-button">
            <button
              className={
                listening
                  ? "voice-button-icon voice-button-icon-active"
                  : "voice-button-icon"
              }
              onClick={() => {
                if (!listening) {
                  SpeechRecognition.startListening({
                    language: "en-IN",
                    continuous: true,
                  });
                } else {
                  SpeechRecognition.stopListening();
                }
              }}
            >
              <img
                style={{ maxWidth: "40px", imageRendering: "pixelated" }}
                src={mic}
                alt="speak icon"
              />
            </button>
          </div>
          {listening && (
            <div className="voice-coder">
              <Visualizer bars={bars} />
            </div>
          )}
        </div>
        <div className="column">
          <h3>Your imagination:</h3>
          <p>{transcript}</p>
        </div>
      </div>
    </div>
  );
}

export default DoodlePad;
