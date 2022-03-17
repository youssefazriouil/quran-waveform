import { useEffect, useRef, useState } from 'react';
import { WaveSurferParams } from 'wavesurfer.js/types/params';
import CursorPlugin from 'wavesurfer.js/src/plugin/cursor';
import { FaPlay, FaStop, FaPause, FaCommentAlt } from 'react-icons/fa';
import { Button } from './Button';

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
  const [isPlaying, setPlaying] = useState(false);
  const waveRef = useRef<HTMLDivElement>(null);
  const [showAddComment, setShowAddComment] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [left, setLeft] = useState(0);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    createWaveForm();
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioURL]);

  const createWaveForm = async () => {
    const WaveSurfer = (await import('wavesurfer.js')).default;
    const options = getWaveFormOptions(`#waveform${index}`);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(audioURL);

    wavesurfer.current.on('seek', (position: number) => {
      if (waveRef.current) {
        const waveDim = waveRef.current.getBoundingClientRect();
        setLeft(waveDim.width * position);
        setShowAddComment(true);
      }
    });
  };

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setPlaying(wavesurfer.current?.isPlaying());
    }
  };

  return (
    <div className={`${className || ''} mb-8 relative`} ref={waveRef}>
      <div id={`waveform${index}`} className='border relative rounded-md'></div>
      <button
        type='button'
        className='absolute'
        style={{ left: left - 11 }}
        onClick={() => setOpenComment(true)}
      >
        {<FaCommentAlt />}
      </button>
      {openComment && (
        <div className='w-full min-h-[100px] border rounded-md p-4'>Hallo</div>
      )}
      <Button onClick={handlePlayPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </Button>
      <Button onClick={() => null}>
        <FaStop />
      </Button>

      <span>{`${wavesurfer.current
        ?.getCurrentTime()
        .toFixed(2)} / ${wavesurfer.current?.getDuration().toFixed(2)}`}</span>
      <hr />
    </div>
  );
};

export default Wave;
