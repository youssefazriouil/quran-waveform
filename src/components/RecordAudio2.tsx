import { useRef, useState } from 'react';
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';
import WaveSurfer from 'wavesurfer.js';

export default () => {
  const [isRecording, setRecording] = useState(false);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const initWaveform = async () => {
    wavesurfer.current = (await import('wavesurfer.js')).default.create({
      container: '#speech',
      waveColor: 'black',
      interact: false,
      cursorWidth: 0,
      plugins: [
        MicrophonePlugin.create({
          constraints: { audio: true, video: false },
        }),
      ],
    });
  };

  const handleRecord = async () => {
    setRecording(true);
    !wavesurfer.current && (await initWaveform());
    wavesurfer.current?.microphone.start();
  };

  const handleStop = () => {
    setRecording(false);
    wavesurfer.current?.microphone.stop();
  };

  return (
    <div>
      <button
        onClick={isRecording ? handleStop : handleRecord}
        className='rounded bg-rose-500 p-4 text-cyan-50 hover:bg-rose-600'
      >
        {isRecording ? 'Stop' : 'Record'}
      </button>
      <div id='speech' />
    </div>
  );
};
