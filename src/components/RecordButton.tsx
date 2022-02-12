interface RecordButtonProps {
  isRecording: boolean;
  handleStop: () => void;
  handleRecord: () => void;
}

export const RecordButton = ({
  isRecording,
  handleStop,
  handleRecord,
}: RecordButtonProps) => {
  const transitionClassRecordBtn = 'transition-all duration-200 ease-in-out';
  return (
    <button
      onClick={isRecording ? handleStop : handleRecord}
      className={` bg-white border border-red-500 rounded-full w-8 h-8`}
    >
      <div
        className={`${transitionClassRecordBtn} bg-red-500 m-auto ${
          isRecording
            ? 'animate-pulse rounded-[3px] w-4 h-4'
            : 'rounded-full w-6 h-6'
        }`}
      />
    </button>
  );
};
