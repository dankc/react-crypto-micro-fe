import './App.css';
import { useEffect } from 'react';
import { useCoinListStore } from './store/coin-store.ts';
import Ticker from './components/Ticker';
import CoinList from './components/CoinList.tsx';

function App() {
  const { selectedCoins, coinList, initialize } = useCoinListStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <main>
      <h1>Crypto Tracker</h1>
      {coinList.length && <CoinList />}
      {selectedCoins.length && <Ticker />}
    </main>
  );
}

export default App;
