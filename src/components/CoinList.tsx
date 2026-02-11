import type { NamedOkxInstrumentData, OkxInstrumentData } from '../@types/coin';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCoinListStore } from '../store/coin-store.ts';
import SearchIcon from '@/components/icons/Search.tsx';
import ToastModal from '@/components/ToastModal.tsx';

export default function CoinList() {
  const { selectedCoins, coinList, toggleCoin } = useCoinListStore();
  const [isListVisible, setListVisibility] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<NamedOkxInstrumentData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const orderedCoins = Array.from(new Set([...coinList.filter(coin => selectedCoins.includes(coin.baseCcy)), ...coinList]));

  const portalRoot = document.getElementById('crypto-app')!;

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
  function escClose(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') setListVisibility(false);
  }

  useEffect(() => {
    const modal = modalRef.current;
    function focusInput() {
      if (isListVisible) inputRef.current?.focus();
    }
    modal?.addEventListener('transitionend', focusInput);
    return () => {
      modal?.removeEventListener('transitionend', focusInput);
    };
  }, [isListVisible]);

  return (
    <>
      <button onClick={toggleList}>
        <SearchIcon className="w-[32px] h-[32px] fill-white" />
      </button>
      {portalRoot
        && createPortal(
          <ToastModal isActive={isListVisible} toggleFn={setListVisibility} asideRef={modalRef}>
            <div
              className={`grid grid-cols-1 max-h-full ${searchList.length ? 'grid-rows-[max-content_minmax(0,1fr)_max-content_minmax(0,1fr)]' : 'grid-rows-[max-content_1fr]'}`}
            >
              <label className="" htmlFor="coin-searchbar">
                <span className="hidden">Search for a coin</span>
                <input
                  ref={inputRef}
                  type="search"
                  id="coin-searchbar"
                  tabIndex={isListVisible ? 0 : -1}
                  placeholder="eg. $BTC or Bitcoin"
                  className="p-2 mb-4 outline-white outline-1 w-full"
                  onChange={(e) => searchCoinList(e.target.value)}
                  onKeyUp={escClose}
                />
              </label>

              {searchList.length > 0 && (
                <ul className="overflow-y-auto" tabIndex={isListVisible ? 0 : -1}>
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

              <ul className="flex flex-wrap list-none gap-4 overflow-y-auto" tabIndex={isListVisible ? 0 : -1}>
                {orderedCoins.map((coinObj: NamedOkxInstrumentData) => (
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
          </ToastModal>,
          portalRoot
        )}
    </>
  );
}
