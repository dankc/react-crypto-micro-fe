import type { OkxInstrumentData, NamedOkxInstrumentData } from './@types/coin';
import { useState, useEffect } from 'react';
import './App.css';
import Ticker from './components/Ticker';
import dictionary from './data/coin-dictionary.json';

const defaultSymbols = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE'];

function App() {
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [coinList, setCoinList] = useState<NamedOkxInstrumentData[]>([]);

  function addCoin(symbol: string) {
    setSelectedCoins([...selectedCoins, symbol.toUpperCase()]);
  }
  function removeCoin(coin: string) {
    const index = selectedCoins.findIndex((_coin) => _coin === coin.toUpperCase());
    if (index > -1) {
      const clone = [...selectedCoins];
      clone.splice(index, 1);
      setSelectedCoins(clone);
    } else {
      console.error(`Coin ${coin} not found`);
    }
  }
  function toggleCoin(coin: string) {
    if (!selectedCoins.includes(coin)) {
      addCoin(coin);
    } else {
      removeCoin(coin);
    }
  }

  const fetchCoinList = async () => {
    const cachedCoinList = sessionStorage.getItem('coinList');
    if (cachedCoinList) {
      const cached = JSON.parse(cachedCoinList);
      setCoinList([...cached]);
      return;
    }

    const data = await fetch('https://www.okx.com/api/v5/public/instruments?instType=SPOT', {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      mode: 'cors',
    });
    const json = await data.json();
    const allCoins = json.data;
    // Only show coins with USDT pair
    const usdtPairs = allCoins.filter((coinObj: OkxInstrumentData) => coinObj.quoteCcy === 'USDT');

    const joinedData = usdtPairs
      .map((entry: OkxInstrumentData) => {
        const name = dictionary.find((coin) => coin.symbol.toUpperCase() === entry.baseCcy)?.name;
        return { ...entry, name };
      })
      .filter((coinObj: NamedOkxInstrumentData) => 'name' in coinObj); // Only display coins with a name
    setCoinList([...joinedData]);
    sessionStorage.setItem('coinList', JSON.stringify(joinedData));
  };

  useEffect(() => {
    const cachedSelectedCoins = sessionStorage.getItem('selectedCoins');
    if (cachedSelectedCoins) {
      const cached = JSON.parse(cachedSelectedCoins);
      setSelectedCoins([...cached]);
    } else setSelectedCoins([...defaultSymbols]);
    fetchCoinList();
  }, []);
  useEffect(() => {
    sessionStorage.setItem('selectedCoins', JSON.stringify(selectedCoins));
  }, [selectedCoins]);

  return (
    <main>
      <h1>Crypto Tracker</h1>
      {coinList.length && (
        <ul className="flex flex-wrap list-none gap-4">
          {coinList.map((coinObj: NamedOkxInstrumentData) => (
            <li
              key={coinObj.baseCcy}
              className={`${selectedCoins.includes(coinObj.baseCcy) ? 'bg-white text-black' : ''} cursor-pointer`}
              onClick={() => toggleCoin(coinObj.baseCcy)}
            >
              {coinObj.name || coinObj.baseCcy}
            </li>
          ))}
        </ul>
      )}
      <Ticker symbols={selectedCoins}></Ticker>
    </main>
  );
}

export default App;
