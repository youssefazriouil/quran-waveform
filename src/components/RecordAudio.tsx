import { useEffect, useRef, useState } from 'react';
import { useTimer } from 'hooks/use-timer';
import Wave from 'components/Wave';
import { RecordButton } from 'components/RecordButton';
import { formatSecondsToTime } from 'helpers';
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';
import { WaveSurferParams } from 'wavesurfer.js/types/params';
import { useAtom } from 'jotai';
import { updateWavesAtom } from 'store/waveforms';

const RecordAudio = () => {
  const [isRecording, setRecording] = useState(false);
  const [waves, addToWaves] = useAtom(updateWavesAtom);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { time, startTimer, stopTimer } = useTimer();

  const getWaveFormOptions = (cssSelector: string): WaveSurferParams => ({
    container: cssSelector,
    waveColor: 'black',
    interact: false,
    cursorWidth: 0,
    plugins: [
      MicrophonePlugin.create({
        constraints: { audio: true, video: false },
      }),
    ],
  });

  const startRecording = () => {
    startTimer();
    setRecording(true);
    audioChunks.current = [];
    wavesurfer.current?.microphone.start();
    wavesurfer.current?.play();
  };

  const stopRecording = () => {
    stopTimer();
    setRecording(false);
    wavesurfer.current?.microphone.stop();
    wavesurfer.current?.stop();
    mediaRecorder?.current?.stop();
  };

  useEffect(() => {
    const initWaveSurfer = async () => {
      if (!wavesurfer.current) {
        const WaveSurfer = (await import('wavesurfer.js')).default;
        const options = getWaveFormOptions(`#speech`);
        wavesurfer.current = WaveSurfer.create(options);
      }
    };
    initWaveSurfer();
  }, []);

  useEffect(() => {
    wavesurfer.current?.microphone &&
      wavesurfer.current?.microphone.on(
        'deviceReady',
        (stream: MediaStream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current?.addEventListener(
            'dataavailable',
            handleDataAvailable
          );
          mediaRecorder.current?.addEventListener(
            'stop',
            handleStopMediaRecorder
          );
          mediaRecorder.current?.start();
        }
      );
  }, [wavesurfer.current?.microphone]);

  const handleDataAvailable = (e: BlobEvent) => {
    audioChunks.current.push(e.data);
  };

  const handleStopMediaRecorder = () => {
    const blob = new Blob(audioChunks.current, {
      type: 'audio/ogg; codecs=opus',
    });
    const wave = window.URL.createObjectURL(blob);

    if (wave) addToWaves(wave);

    mediaRecorder.current?.removeEventListener(
      'dataavailable',
      handleDataAvailable
    );
    mediaRecorder.current?.removeEventListener('stop', handleStopMediaRecorder);
    mediaRecorder.current = null;
  };

  return (
    <div className='RecordAudio'>
      <div
        className={`bg-rose-100 p-4 mb-4 rounded-sm items-center transition-all ${
          isRecording ? 'max-h-48' : 'max-h-16'
        }`}
      >
        <RecordButton
          handleRecord={startRecording}
          handleStop={stopRecording}
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
        <Wave audioURL={wave} key={index} index={index} />
      ))}
    </div>
  );
};

export default RecordAudio;
