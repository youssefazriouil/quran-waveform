export const formatSecondsToTime = (secs: number) => {
  const date = new Date(1000 * secs);
  return date.toISOString().substring(14, 19);
};
