import { Fragment, useEffect, useRef, useState } from 'react';
import { useTimer } from 'hooks/use-timer';
import Wave from 'components/Wave';
import { RecordButton } from 'components/RecordButton';
import { formatSecondsToTime } from 'helpers';
// import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone';

const RecordAudio = () => {
  const [isRecording, setRecording] = useState(false);
  const [waves, setWaves] = useState<string[]>([]);
  const { time, startTimer, stopTimer } = useTimer();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setMediaRecorder(new MediaRecorder(stream));
        })
        .catch(function (err) {
          console.log('The following getUserMedia error occurred: ' + err);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }, []);

  let chunks: Blob[] = [];

  const handleRecord = () => {
    startTimer();
    setRecording(true);
    mediaRecorder?.start();
    console.log(mediaRecorder?.state);
  };

  const handleStop = () => {
    stopTimer();
    setRecording(false);
    mediaRecorder?.stop();
  };

  if (mediaRecorder) {
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
    mediaRecorder.onstop = function () {
      console.log('recorder stopped');

      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      chunks = [];
      const wave = window.URL.createObjectURL(blob);
      wave && setWaves((waves) => waves.concat(wave));
    };
  }

  return (
    <div className='RecordAudio'>
      <div className='bg-rose-100 p-4 mb-4 rounded-sm flex items-center'>
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
