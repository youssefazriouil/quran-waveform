import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>WaveForm</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='w-screen h-screen flex items-center justify-center'>
        Hallo allemaal
      </main>
    </div>
  );
};

export default Home;
