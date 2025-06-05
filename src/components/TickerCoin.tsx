import type { CoinPrice } from '../@types/coin';
import React, { useRef, useEffect } from 'react';

const TickerCoin = React.memo(({ coin }: { coin: CoinPrice }) => {
  const { last, bid, ask, high, low, id } = coin;
  const prevPriceRef = useRef<number | null>(null);

  const colorClass = prevPriceRef.current === null || +last >= prevPriceRef.current ? 'text-green-500' : 'text-red-500';
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
    <div className="coin-stats flex flex-wrap gap-2 my-8 mx-auto max-w-2xl">
      <h2 className="flex-1-0 w-full center text-2xl font-bold">{id}</h2>
      <div className="flex-1-0 w-full">
        Last price: <span className={`${colorClass} font-bold`}>${formatPrice(last)}</span>
      </div>
      <div>
        Bid: <span>${formatPrice(bid)}</span>
      </div>
      <div>
        Ask: <span>${formatPrice(ask)}</span>
      </div>
      <div>
        24h High: <span className="text-green-500">${formatPrice(high)}</span>
      </div>
      <div>
        24h Low: <span className="text-red-500">${formatPrice(low)}</span>
      </div>
    </div>
  );
});
export default TickerCoin;
