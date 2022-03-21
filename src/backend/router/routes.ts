import { z } from 'zod';
import * as trpc from '@trpc/server';

interface Ayah {
  number: number;
  text: string;
}

export const appRouter = trpc.router().query('get-surah-by-number', {
  input: z.object({
    surahNumber: z
      .number()
      .min(1, 'Invalid surah number')
      .max(114, 'Invalid surah number'),
  }),
  async resolve({ input }) {
    if (input.surahNumber) {
      const surahInfo = await fetch(
        `https://api.alquran.cloud/v1/surah/${input.surahNumber}/quran-uthmani`
      );
      const surahData = await surahInfo.json();

      return {
        surah: {
          ayahs: surahData.data.ayahs as Ayah[],
        },
      };
    }
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
