import type { NamedOkxInstrumentData, OkxInstrumentData } from '../@types/coin';
import { useState } from 'react';
import { useCoinListStore } from '../store/coin-store.ts';

export default function CoinList() {
  const { selectedCoins, coinList, toggleCoin } = useCoinListStore();
  const [isListVisible, setListVisibility] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<NamedOkxInstrumentData[]>([]);
  // @@TODO add sorting so selected coins are at the beginning of the non-search list
  function toggleList() {
    setListVisibility(!isListVisible);
  }
  function clearSearchList() {
    setSearchList([]);
  }
  function selectCoin(coin: NamedOkxInstrumentData) {
    toggleCoin(coin.baseCcy);
    clearSearchList();
  }
  function searchCoinList(value: string) {
    if (!value) {
      clearSearchList();
      return;
    }
    if (value.charAt(0) === '$') {
      const symbol = value.replace('$', '');
      const result = coinList.filter((coin: OkxInstrumentData) => new RegExp(symbol, 'i').test(coin.baseCcy));
      setSearchList(result);
    } else {
      const result = coinList.filter((coin: NamedOkxInstrumentData) => coin.name && new RegExp(value, 'i').test(coin.name));
      setSearchList(result);
    }
  }

  return (
    <>
      <button className="menu" onClick={toggleList}>
        [COIN DRAWER TOGGLE]
      </button>
      <div
        className={`absolute top-0 right-0 w-1/4 p-4 transition-transform duration-200 ease-in-out ${!isListVisible && 'translate-x-full'}`}
      >
        <input
          type="search"
          placeholder="Enter a $symbol or name"
          className=" p-2 mb-4 outline-white outline-1 w-full"
          onChange={(e) => searchCoinList(e.target.value)}
        />

        {searchList.length > 0 && (
          <ul>
            {searchList.map((coin: NamedOkxInstrumentData) => (
              <li
                key={coin.baseCcy}
                className={`${selectedCoins.includes(coin.baseCcy) ? 'bg-white text-black' : ''} cursor-pointer`}
                onClick={() => selectCoin(coin)}
              >
                {coin.name}
              </li>
            ))}
          </ul>
        )}

        <ul className="flex flex-wrap list-none gap-4">
          {coinList.map((coinObj: NamedOkxInstrumentData) => (
            <li
              key={coinObj.baseCcy}
              className={`${selectedCoins.includes(coinObj.baseCcy) ? 'bg-white text-black' : ''} cursor-pointer`}
              onClick={() => selectCoin(coinObj)}
            >
              {coinObj.name || coinObj.baseCcy}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
