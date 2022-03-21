import { GetStaticProps } from 'next';
import suwar from '../suwarData';
import Link from 'next/link';

const WordForWord = () => {
  return (
    <div className='w-full h-full flex'>
      <nav className='bg-ocean w-[15%] text-white px-5 py-4'>
        <div className='text-lg mb-4'>Dar el Quran</div>
        <div className='flex flex-col'>
          <div>Link 1</div>
          <div>Link 2</div>
          <div>Link 3</div>
        </div>
      </nav>
      <main className='bg-sand-100 grow p-40'>
        <div className='space-y-6'>
          {suwar.map((surah, index) => (
            <Link href={`surah/${surah.number}`} key={index}>
              <div className='bg-sand-200 flex items-center rounded hover:bg-sand-300 cursor-pointer transition-colors'>
                <img
                  className='max-h-[100px]'
                  src={surah.logoUrl}
                  loading='lazy'
                />
                <span className='text-lg text-darkGray'>{`${surah.number}. ${surah.name}`}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default WordForWord;
