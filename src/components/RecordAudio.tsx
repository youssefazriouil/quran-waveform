import { Fragment, useRef, useState } from 'react';
import { useTimer } from 'hooks/use-timer';
import Wave from 'components/Wave';
import { RecordButton } from 'components/RecordButton';
import { formatSecondsToTime } from 'helpers';
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';
import { WaveSurferParams } from 'wavesurfer.js/types/params';

const RecordAudio = () => {
  const [isRecording, setRecording] = useState(false);
  const [waves, setWaves] = useState<string[]>([]);
  const { time, startTimer, stopTimer } = useTimer();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const getWaveFormOptions = (cssSelector: string): WaveSurferParams => ({
    container: cssSelector,
    waveColor: 'black',
    interact: false,
    cursorWidth: 0,
    // height: isRecording ? 128 : 0,
    plugins: [
      MicrophonePlugin.create({
        constraints: { audio: true, video: false },
      }),
    ],
  });

  let chunks: Blob[] = [];

  const handleRecord = async () => {
    startTimer();
    setRecording(true);
    if (!wavesurfer.current) {
      const WaveSurfer = (await import('wavesurfer.js')).default;
      const options = getWaveFormOptions(`#speech`);
      wavesurfer.current = WaveSurfer.create(options);
      createWaveForm();
    }
    wavesurfer.current?.microphone.start();
  };

  const handleStop = () => {
    stopTimer();
    setRecording(false);
    wavesurfer.current?.microphone.stop();
    mediaRecorder?.stop();
  };

  const createWaveForm = () => {
    wavesurfer.current?.microphone.on('deviceReady', (stream: MediaStream) => {
      const newMediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(newMediaRecorder);
      newMediaRecorder.start();

      newMediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      newMediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const wave = window.URL.createObjectURL(blob);
        wave && setWaves((waves) => waves.concat(wave));
      };
    });
  };

  return (
    <div className='RecordAudio'>
      <div
        className={`bg-rose-100 p-4 mb-4 rounded-sm items-center transition-all ${
          isRecording ? 'max-h-48' : 'max-h-16'
        }`}
      >
        <RecordButton
          handleRecord={handleRecord}
          handleStop={handleStop}
          isRecording={isRecording}
        />
        <span
          className={`ml-2 transition-all duration-300 ${
            isRecording ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {formatSecondsToTime(time)}
        </span>
        <div id='speech'></div>
      </div>
      {waves.map((wave, index) => (
        <Fragment key={index}>
          <Wave audioURL={wave} index={index} />
        </Fragment>
      ))}
    </div>
  );
};

export default RecordAudio;
