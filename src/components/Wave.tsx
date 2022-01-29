import { useEffect, useRef, useState } from 'react';
import { WaveSurferParams } from 'wavesurfer.js/types/params';
import CursorPlugin from 'wavesurfer.js/src/plugin/cursor';

const getWaveFormOptions = (cssSelector: string): WaveSurferParams => ({
  container: cssSelector,
  waveColor: '#D9DCFF',
  progressColor: '#4353FF',
  cursorColor: '#4353FF',
  barWidth: 3,
  barRadius: 3,
  cursorWidth: 1,
  height: 100,
  barGap: 3,
  scrollParent: true,
  plugins: [
    CursorPlugin.create({
      showTime: true,
      opacity: '0.5',
      customShowTimeStyle: {
        'background-color': '#000',
        color: '#fff',
        padding: '2px',
        'font-size': '10px',
      },
    }),
  ],
});

interface WaveAudioProps {
  audioURL: string;
  className?: string;
  index: number;
}

const Wave = ({ audioURL, className, index }: WaveAudioProps) => {
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    createWaveForm();
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const createWaveForm = async () => {
    const WaveSurfer = (await import('wavesurfer.js')).default;
    const options = getWaveFormOptions(`#waveform${index}`);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(audioURL);
  };

  const handlePlayPause = () => {
    wavesurfer.current && wavesurfer.current.playPause();
  };

  return (
    <div className={`${className} mb-8`}>
      <div id={`waveform${index}`} className='border relative'></div>
      <button className='border p-2 mt-4 mb-4' onClick={handlePlayPause}>
        Play / Pause
      </button>
      <hr />
    </div>
  );
};

export default Wave;
