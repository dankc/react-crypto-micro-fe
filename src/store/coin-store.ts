import type { NamedOkxInstrumentData, OkxInstrumentData } from '../@types/coin';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import dictionary from '../data/coin-dictionary.json';
import { createJSONStorage } from 'zustand/middleware';

interface CoinListStore {
  selectedCoins: string[];
  coinList: Array<NamedOkxInstrumentData>;
  initialize: () => void;
  toggleCoin: (coin: string) => void;
}
const defaultSymbols = ['BTC', 'ETH', 'XRP', 'SOL', 'DOGE'];
async function fetchCoinList() {
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

  // Only show coins with a name to display
  return usdtPairs
    .map((entry: OkxInstrumentData) => {
      const name = dictionary.find((coin) => coin.symbol.toUpperCase() === entry.baseCcy)?.name;
      return { ...entry, name };
    })
    .filter((coinObj: NamedOkxInstrumentData) => 'name' in coinObj && coinObj.name !== undefined);
}

const useCoinListStore = create<CoinListStore>()(
  devtools(
    persist(
      (set, get) => ({
        selectedCoins: [],
        coinList: [],
        initialize: () => {
          const { coinList } = get();
          set((state) =>
            !state.selectedCoins.length
              ? { selectedCoins: [...defaultSymbols], coinList: [...coinList] }
              : { coinList: [...coinList] }
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
        storage: createJSONStorage(() => ({
          getItem: async (name) => {
            // Check if a previously selected coin has been delisted and remove it
            const coinBackup = localStorage.getItem(name);
            if( coinBackup ) {
              const parsedBackup = JSON.parse(coinBackup);
              const allCoins = await fetchCoinList();
              const hydratedState = {
                state: {
                  selectedCoins: [],
                  coinList: [...allCoins],
                },
              };

              hydratedState.state.selectedCoins = parsedBackup.state.selectedCoins.filter((selectedCoin: string) =>
                allCoins.some((coin: OkxInstrumentData) => coin.baseCcy === selectedCoin)
              );

              return JSON.stringify(hydratedState);
            }

            return null;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, value);
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        })),
      }
    )
  )
);

export { useCoinListStore };
