import router, { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import suwarData from 'suwarData';
import { FaChevronLeft as BackIcon } from 'react-icons/fa';
import { trpc } from 'utils/trpc';

interface SurahPageProps {
  name: string;
  number: number;
  logoUrl: string;
}

const SurahPage = ({ logoUrl, name, number }: SurahPageProps) => {
  const { data, isLoading } = trpc.useQuery(
    ['get-surah-by-number', { surahNumber: number }],
    { enabled: !!number }
  );

  if (isLoading) return <div>Loading...</div>;
  return (
    <main className='p-10 bg-sand-100 w-full min-h-screen'>
      <BackIcon
        className='w-6 h-6 text-darkGray hover:text-black cursor-pointer'
        onClick={router.back}
      />
      <img src={logoUrl} className='w-[300px] m-auto' />
      <h2 className='text-xl text-center'>{`${number}. ${name}`}</h2>
      <section dir='rtl'>
        {data?.surah?.ayahs?.map((ayah, index) => (
          <div key={index} className='text-2xl'>
            {ayah.numberInSurah} - {ayah.text}
          </div>
        ))}
      </section>
    </main>
  );
};

export default SurahPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const number = (params?.number || '') as string;

  const mySurah = suwarData.find((s) => s.number === parseInt(number));
  return {
    props: mySurah || {},
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: suwarData.map((s) => ({
      params: { number: `${s.number}` },
    })),
    fallback: false,
  };
};
