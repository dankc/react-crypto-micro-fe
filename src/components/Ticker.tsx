import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { CoinPrice, OkxMarketData } from '../@types/coin';
import { useCoinListStore } from '../store/coin-store.ts';
import TickerCoin from './TickerCoin';

interface CoinState {
  [key: string]: CoinPrice;
}
interface CoinReducerUpdateAction {
  type: 'UPDATE_COIN';
  payload: {
    symbol: string;
    data: CoinPrice;
  };
}
interface CoinReducerSyncAction {
  type: 'SYNC_COINS';
  payload: string[];
}

function coinReducer(state: CoinState, action: CoinReducerUpdateAction | CoinReducerSyncAction): CoinState {
  switch (action.type) {
    case 'UPDATE_COIN': {
      const currentCoinState: CoinPrice = state[action.payload.symbol];
      const newData = action.payload.data as CoinPrice;

      if (
        currentCoinState
        && currentCoinState.last === newData.last
        && currentCoinState.ask === newData.ask
        && currentCoinState.bid === newData.bid
        && currentCoinState.high === newData.high
        && currentCoinState.low === newData.low
      ) {
        return state;
      }
      return {
        ...state,
        [action.payload.symbol]: {
          ...state[action.payload.symbol],
          ...action.payload.data,
        },
      };
    }
    case 'SYNC_COINS': {
      const newState: CoinState = {};
      action.payload.forEach((symbol: string) => {
        const key = `${symbol.toUpperCase()}-USDT`;
        newState[key] = state[key] || {
          ...startingCoinState,
          id: `${symbol.toUpperCase()}-USDT`,
        };
      });
      return newState;
    }
    default:
      return state;
  }
}
const startingCoinState = { last: '0', ask: '0', bid: '0', high: '0', low: '0' };

export default function Ticker() {
  const [coinState, coinDispatch] = useReducer(coinReducer, {});
  const wsRef = useRef<WebSocket | null>(null);
  const prevSymbolsRef = useRef<string[]>([]);
  const { selectedCoins } = useCoinListStore();
  // FOR TESTING
  const [isConnected, setIsConnected] = useState(true);

  const subscribe = useCallback(
    (newSymbols: string[]) => {
      const coinsToRemove = prevSymbolsRef.current?.filter((sy) => !newSymbols.includes(sy));
      const coinsToAdd = newSymbols.filter((sy) => !prevSymbolsRef.current.includes(sy));

      if (coinsToRemove.length) {
        wsRef.current?.send(
          JSON.stringify({
            op: 'unsubscribe',
            args: coinsToRemove.map((symbol) => ({
              channel: 'tickers',
              instId: `${symbol.toUpperCase()}-USDT`,
              instType: 'SPOT',
            })),
          })
        );
      } else if (coinsToAdd.length) {
        wsRef.current?.send(
          JSON.stringify({
            op: 'subscribe',
            args: coinsToAdd.map((symbol) => ({
              channel: 'tickers',
              instId: `${symbol.toUpperCase()}-USDT`,
              instType: 'SPOT',
            })),
          })
        );
      } else {
        wsRef.current?.send(
          JSON.stringify({
            op: 'subscribe',
            args: newSymbols.map((symbol) => ({
              channel: 'tickers',
              instId: `${symbol.toUpperCase()}-USDT`,
              instType: 'SPOT',
            })),
          })
        );
      }
    },
    [prevSymbolsRef]
  );

  const connect = useCallback(
    (_symbols: string[]) => {
      const okxHost = 'wss://ws.okx.com:8443/ws/v5/public';

      wsRef.current = new WebSocket(okxHost);
      wsRef.current.onopen = () => {
        subscribe(_symbols);
      };
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.data && data.data.length > 0) {
          const coinData: OkxMarketData = data.data[0];
          const { askPx, bidPx, high24h, low24h, last, instId } = coinData;
          coinDispatch({
            type: 'UPDATE_COIN',
            payload: {
              symbol: instId,
              data: { ask: askPx, bid: bidPx, last, high: high24h, low: low24h, id: instId },
            },
          });
        }
      };
      wsRef.current.onclose = () => {
        console.log('Socket closed');
        wsRef.current = null;
      };
      wsRef.current.onerror = (event: Event) => {
        setIsConnected(false);
        console.error(event);
      };
    },
    [subscribe, coinDispatch]
  );

  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isConnected || !selectedCoins.length) {
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      connect(selectedCoins);
    } else if (wsRef.current.readyState === WebSocket.OPEN) {
      subscribe(selectedCoins);
    }

    return () => {
      prevSymbolsRef.current = selectedCoins;
    };
  }, [selectedCoins, connect, subscribe, isConnected]);

  return (
    <>
      <div className="controls">
        <button onClick={() => setIsConnected(() => !isConnected)}>{isConnected ? 'Stop WebSocket' : 'Start WebSocket'}</button>
      </div>
      {Object.values(coinState).map((coin) => (
        <TickerCoin key={`ticker-${coin.id}`} coin={coin} />
      ))}
    </>
  );
}
