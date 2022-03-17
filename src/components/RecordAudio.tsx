import { useRef, useState } from 'react';
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';
import WaveSurfer from 'wavesurfer.js';
import { useAtom } from 'jotai';
import { updateWavesAtom } from 'store/waveforms';
import Wave from './Wave';
import { RecordButton } from './RecordButton';
import { formatSecondsToTime } from 'helpers';
import { useTimer } from 'hooks/use-timer';

export default () => {
  const [isRecording, setRecording] = useState(false);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [waves, addToWaves] = useAtom(updateWavesAtom);
  const { time, startTimer, stopTimer } = useTimer();

  const initWaveform = async () => {
    wavesurfer.current = (await import('wavesurfer.js')).default.create({
      container: '#speech',
      waveColor: '#262626',
      interact: false,
      cursorWidth: 0,
      plugins: [
        MicrophonePlugin.create({
          constraints: { audio: true, video: false },
        }),
      ],
    });
  };

  const handleStartMediaRecorder = () => {
    wavesurfer.current?.microphone.once(
      'deviceReady',
      (stream: MediaStream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current?.start();
        mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
          audioChunks.current.push(e.data);
        };
        mediaRecorder.current.onstop = () => {
          const blob = new Blob(audioChunks.current, {
            type: 'audio/ogg; codecs=opus',
          });
          const wave = window.URL.createObjectURL(blob);
          wave && addToWaves(wave);
        };
      }
    );
  };

  const handleRecord = async () => {
    setRecording(true);
    startTimer();
    audioChunks.current = [];
    !wavesurfer.current && (await initWaveform());
    wavesurfer.current?.microphone.start();
    handleStartMediaRecorder();
  };

  const handleStop = () => {
    setRecording(false);
    stopTimer();
    wavesurfer.current?.microphone.stop();
    mediaRecorder.current?.stop();
  };

  return (
    <>
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
        <div id='speech' className='max-w-5xl'></div>
      </div>
      {waves.map((wave, index) => (
        <Wave audioURL={wave} key={index} index={index} />
      ))}
    </>
  );
};
