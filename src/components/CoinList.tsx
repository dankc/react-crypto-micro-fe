import type { NamedOkxInstrumentData } from '../@types/coin';
import { useState } from 'react';
import { useCoinListStore } from '../store/coin-store.ts';

export default function CoinList() {
  const { selectedCoins, coinList, toggleCoin } = useCoinListStore();
  const [isListVisible, setListVisibility] = useState<boolean>(false);
  function toggleList() {
    setListVisibility(!isListVisible);
  }

  return (
    <>
      <button className="menu" onClick={toggleList}>
        [COIN DRAWER TOGGLE]
      </button>
      <div
        className={`absolute top-0 right-0 w-1/4 p-4 transition-transform duration-200 ease-in-out ${!isListVisible && 'translate-x-full'}`}
      >
        {/* @@TODO add search functionality */}
        <input type="search" placeholder="Search by symbol" className="p-2 mb-4 outline-white outline-1 w-full" />
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
      </div>
    </>
  );
}
