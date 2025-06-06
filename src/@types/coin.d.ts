interface CoinPrice {
  last: string;
  ask: string;
  bid: string;
  high: string;
  low: string;
  id?: string;
}

interface OkxMarketData {
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  high24h: string;
  instId: string;
  instType: string;
  last: string;
  lastSz: string;
  low24h: string;
  open24h: string;
  sodUtc0: string;
  sodUtc8: string;
  ts: string;
  vol24h: string;
  volCcy24h: string;
}

interface OkxWsResponse {
  arg: {
    channel: string;
    instId: string;
  };
  data: OkxMarketData;
}

interface OkxErrorResponse {
  event: 'error';
  code: string;
  msg: string;
  connId: string;
}

interface OkxUnsubResponse {
  arg: {
    channel: string;
    instId: string;
  };
  connId: string;
  event: 'unsubscribe';
}

interface OkxInstrumentData {
  auctionEndTime: string;
  baseCcy: string;
  ctMult: string;
  ctType: string;
  ctVal: string;
  ctValCcy: string;
  expTime: string;
  futureSettlement: false;
  instFamily: string;
  instId: string;
  instType: 'SPOT';
  lever: string;
  listTime: string;
  lotSz: string;
  maxIcebergSz: string;
  maxLmtAmt: string;
  maxLmtSz: string;
  maxMktAmt: string;
  maxMktSz: string;
  maxStopSz: string;
  maxTriggerSz: string;
  maxTwapSz: string;
  minSz: string;
  optType: string;
  quoteCcy: string;
  settleCcy: string;
  state: 'live' | 'suspend' | 'preopen';
  ruleType: 'normal' | 'pre_market';
  stk?: string;
  tickSz: string;
  uly: string;
}

interface OkxInstrumentResponse {
  code: string;
  data: OkxInstrumentData[];
  msg: string;
}

interface NamedOkxInstrumentData extends OkxInstrumentData {
  name?: string;
}

export { CoinPrice, OkxMarketData, OkxInstrumentData, NamedOkxInstrumentData, OkxWsResponse, OkxErrorResponse, OkxUnsubResponse };
