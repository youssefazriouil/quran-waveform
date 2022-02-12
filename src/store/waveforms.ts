import { atom } from 'jotai';

const addWave = (waves: string[], newWave: string): string[] => [
  newWave,
  ...waves,
];

export const wavesAtom = atom<string[]>([]);

export const updateWavesAtom = atom(
  (get) => get(wavesAtom),
  (get, set, _args: string) => set(wavesAtom, addWave(get(wavesAtom), _args))
);
