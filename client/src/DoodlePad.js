import { useEffect, useState } from 'react';
import ReactRough, { Rectangle } from 'react-rough';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';
import mic from './mic.png';
import 'quickdraw-component/quickdraw-component';

const Visualizer = ({ bars }) => {
	return bars.map((bar, i) => <span id={`${i + 1}`} style={{ height: bar }} />);
};

function DoodlePad() {
	const [intents, setIntents] = useState([]);
	const [elements, setElements] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const { transcript, listening } = useSpeechRecognition();
	const [bars, setBars] = useState([]);

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: false })
			.then((stream) => {
				if (stream) {
					const context = new (window.AudioContext ||
						window.webkitAudioContext)();
					const source = context.createMediaStreamSource(stream);
					const analyser = context.createAnalyser();
					source.connect(analyser);

					function renderFrame() {
						requestAnimationFrame(renderFrame);
						const frequencyData = new Float32Array(256);
						analyser.getFloatTimeDomainData(frequencyData);
						const bars = [];
						for (let i = 0; i < 54; i++) {
							const val = Math.abs(frequencyData[i]);
							bars.push(`${val * 1000}%`);
						}
						setBars(bars);
					}
					renderFrame();
				}
			});
	}, []);

	useEffect(() => {
		(async () => {
			const data = await fetch('http://localhost:8080/intent', {
				method: 'post',
				body: intents,
			});
			if (data.ok) {
				setElements((v) => [...v, ...intents.set]);
			}
		})();
	}, [intents]);

	const handleMusicClick = () => {
		setIsPlaying(!isPlaying);
	}

	return (
		<div className="App">
			<ReactRough
				width={window.innerWidth}
				height={window.innerHeight - 300}
				renderer="canvas"
			>
				<Rectangle
					x={15}
					y={15}
					width={window.innerWidth - 50}
					height={window.innerHeight - 350}
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

			<hr />

			<div className="row">
				<div className="column">
					<h4>Controls <code>W A S D</code> to move character</h4>
					<div className="column" style={{ margin: 'auto' }}>
						<div className="row">
						<h5 style={{alignSelf: 'center'}}>Music:</h5>
						<button
							type="button"
							className="nes-btn is-primary"
							style={{ marginBottom: '20px', marginLeft: '10px', paddingTop: '0px' }} 
							onClick={handleMusicClick}
						>
							{ isPlaying ? ('❚❚') : ('▶')}
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
									? 'voice-button-icon voice-button-icon-active'
									: 'voice-button-icon'
							}
							onClick={() => {
								if (!listening) {
									SpeechRecognition.startListening({
										language: 'en-IN',
										continuous: true,
									});
								} else {
									SpeechRecognition.stopListening();
								}
							}}
						>
							<img
								style={{ maxWidth: '40px', imageRendering: 'pixelated' }}
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
					<h2>Your imagination:</h2>
					<p>{transcript}</p>
				</div>
			</div>
		</div>
	);
}

export default DoodlePad;
