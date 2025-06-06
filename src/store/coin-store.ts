import type { NamedOkxInstrumentData, OkxInstrumentData } from '../@types/coin';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import dictionary from '../data/coin-dictionary.json';

interface CoinListStore {
  selectedCoins: string[];
  coinList: Array<NamedOkxInstrumentData>;
  initialize: () => void;
  toggleCoin: (coin: string) => void;
}
const defaultSymbols = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE'];

const useCoinListStore = create<CoinListStore>()(
  devtools(
    persist(
      (set) => ({
        selectedCoins: [],
        coinList: [],
        initialize: async () => {
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
          set((state) =>
            !state.selectedCoins.length
              ? { selectedCoins: [...defaultSymbols], coinList: [...joinedData] }
              : { coinList: [...joinedData] }
          );
        },
        toggleCoin: (coin: string) =>
          set((state) => ({
            selectedCoins: state.selectedCoins.includes(coin)
              ? state.selectedCoins.filter((c) => c !== coin)
              : [...state.selectedCoins, coin],
          })),
      }),
      {
        name: 'coin-store',
      }
    )
  )
);

export { useCoinListStore };
