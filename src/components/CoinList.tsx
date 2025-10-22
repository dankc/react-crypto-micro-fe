import type { NamedOkxInstrumentData, OkxInstrumentData } from '../@types/coin';
import { useState } from 'react';
import { useCoinListStore } from '../store/coin-store.ts';
import SearchIcon from '@/components/icons/Search.tsx';

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
      <button onClick={toggleList}>
        <SearchIcon style={{ width: '32px', height: '32px', fill: 'white' }} />
      </button>
      <div
        className={`absolute top-0 right-0 grid grid-cols-1 w-1/4 max-h-dvh p-4 transition-transform duration-200 ease-in-out ${!isListVisible && 'translate-x-full'} ${searchList.length ? 'grid-rows-[max-content_minmax(0,1fr)_max-content_minmax(0,1fr)]' : 'grid-rows-[max-content_1fr]'}`}
      >
        <label className="" htmlFor="coin-searchbar">
          <span className="hidden">Search for a coin</span>
          <input
            type="search"
            id="coin-searchbar"
            tabIndex={isListVisible ? 0 : -1}
            placeholder="Enter a $symbol or name"
            className="p-2 mb-4 outline-white outline-1 w-full"
            onChange={(e) => searchCoinList(e.target.value)}
          />
        </label>

        {searchList.length > 0 && (
          <ul className="overflow-x-auto" tabIndex={isListVisible ? 0 : -1}>
            {searchList.map((coin: NamedOkxInstrumentData) => (
              <li className="my-4" key={coin.baseCcy}>
                <button
                  className={`${selectedCoins.includes(coin.baseCcy) ? 'bg-white text-black' : ''} cursor-pointer  w-full`}
                  onClick={() => selectCoin(coin)}
                >
                  {coin.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {searchList.length > 0 && <hr className="my-8" />}

        <ul className="flex flex-wrap list-none gap-4 overflow-x-auto" tabIndex={isListVisible ? 0 : -1}>
          {coinList.map((coinObj: NamedOkxInstrumentData) => (
            <li key={coinObj.baseCcy}>
              <button
                className={`${selectedCoins.includes(coinObj.baseCcy) ? 'bg-white text-black' : ''} py-2 cursor-pointer`}
                onClick={() => selectCoin(coinObj)}
              >
                {coinObj.name || coinObj.baseCcy}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
