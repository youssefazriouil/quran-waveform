import { Fragment, useEffect, useRef, useState } from 'react';
import { useTimer } from 'hooks/use-timer';
import Wave from 'components/Wave';
import { RecordButton } from 'components/RecordButton';

const RecordAudio = () => {
  const [isRecording, setRecording] = useState(false);
  const [waves, setWaves] = useState<string[]>([]);
  console.log('waves top', waves);
  const [startTime, setStartTime] = useState<number>();
  const { time, startTimer, stopTimer } = useTimer();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

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
    setRecording(true);
    setStartTime(Date.now());
    mediaRecorder?.start();
    console.log(mediaRecorder?.state);
  };

  const handleStop = () => {
    setRecording(false);
    setStartTime(0);
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
      <div className='bg-rose-100 p-4 mb-4 rounded-sm'>
        <RecordButton
          handleRecord={handleRecord}
          handleStop={handleStop}
          isRecording={isRecording}
        />
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
