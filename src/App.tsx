import { useEffect } from 'react';
import { useCoinListStore } from './store/coin-store.ts';
import Header from '@/components/Header.tsx';
import Ticker from '@/components/Ticker.tsx';
import CoinList from '@/components/CoinList.tsx';
// import MenuIcon from '@/components/icons/Menu.tsx';

function App() {
  const { selectedCoins, coinList, initialize } = useCoinListStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <main className="min-h-full px-8 py-16 relative" id="crypto-app">
      <Header />
      <section className="max-w-5xl mx-auto my-12">
        <p>
          This crypto tracker is built with React 19, Zustand, TypeScript, and Tailwind. Data is fetched from OKX's public
          websocket API. You can find the repo of this web app on&nbsp;
          <a href="https://github.com/dankc/react-crypto-micro-fe" target="_blank">
            my Github.
          </a>
        </p>
      </section>
      <section className="max-w-7xl my-12 mx-auto flex gap-x-4 justify-end items-center">
        <strong>Find your coin</strong>
        {coinList.length && <CoinList />}
        {/*Going to add a menu later*/}
        {/*<button>*/}
        {/*  <MenuIcon className="w-[32px] h-[32px] fill-white" />*/}
        {/*</button>*/}
      </section>
      {selectedCoins.length && <Ticker />}
    </main>
  );
}

export default App;
