import type { CoinPrice } from '../@types/coin';
import React, { useRef, useEffect } from 'react';
import dictionary from '../data/coin-dictionary.json';

const TickerCoin = React.memo(({ coin }: { coin: CoinPrice }) => {
  const { last, bid, ask, high, low, id } = coin;
  const dict = dictionary.find((entry) => {
    return entry.symbol === id?.split('-')[0];
  });
  const prevPriceRef = useRef<number | null>(null);

  const colorClass = prevPriceRef.current === null || +last >= prevPriceRef.current ? 'text-green-600' : 'text-red-500';
  const formatPrice = (price: string): string => {
    if (+price < 0.01) return price;
    if (+price < 1) return Number(price).toFixed(4);
    else return Number(price).toFixed(2);
  };

  useEffect(() => {
    return () => {
      if (prevPriceRef.current !== +last) prevPriceRef.current = +last;
    };
  }, [last]);

  return (
    <div className={'bg-[rgb(from_white_r_g_b/0.8)] text-black rounded-2xl p-8 relative overflow-hidden'}>
      <div
        className={`block absolute w-full top-0 left-0 bottom-0 bg-size-[10%] bg-repeat`}
        style={{ backgroundImage: `url(${dict?.logo})`, zIndex: -1 }}
      ></div>

      <h2 className="mb-2 text-4xl text-center font-bold">
        {dict?.name || 'Not available'}
        <span className="block text-lg text-center text-gray-700">({id})</span>
      </h2>

      <div className="mb-4 text-center text-xl">
        Last price: <span className={`${colorClass} font-bold font-mono`}>${formatPrice(last)}</span>
      </div>
      <div className="flex justify-between">
        <span>
          Bid: <span className="font-mono">${formatPrice(bid)}</span>
        </span>
        <span>
          Ask: <span className="font-mono">${formatPrice(ask)}</span>
        </span>
      </div>
      <div className="flex justify-between">
        <span>
          24h High: <span className="text-green-600 font-mono">${formatPrice(high)}</span>
        </span>
        <span>
          24h Low: <span className="text-red-500 font-mono">${formatPrice(low)}</span>
        </span>
      </div>
    </div>
  );
});
export default TickerCoin;
