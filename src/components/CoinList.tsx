import type { NamedOkxInstrumentData } from '../@types/coin';
import { useCoinListStore } from '../store/coin-store.ts';

export default function CoinList() {
  const { selectedCoins, coinList, toggleCoin } = useCoinListStore();

  return (
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
  );
}
