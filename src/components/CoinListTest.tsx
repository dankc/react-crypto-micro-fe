import dictionary from '../data/coins-top-1k.json'; // matched 114 coins & missed 195 with 250 coins, 199 matches & 110 misses with 500 coins, 240 matches & 69 misses with 750 coins, 267 matches & 42 misses with 1k coins; no dupes

export default function DictionaryTest() {
  const unique = [];
  const uniqueList = [];
  const missed = new Set();
  const dupes = new Set();
  const coinList = JSON.parse(sessionStorage.getItem('coinList'));
  coinList.forEach((coin, index) => {
    const dictionaryEntry = dictionary.find((item) => coin.baseCcy === item.symbol.toUpperCase());
    if (dictionaryEntry) {
      if (!unique.some((s) => s === coin.baseCcy)) {
        unique.push(coin.baseCcy);
        uniqueList.push({ name: dictionaryEntry.name, symbol: dictionaryEntry.symbol.toUpperCase(), id: dictionaryEntry.id });
      } else dupes.add(coin.baseCcy);
      if (index === coinList.length - 1) sessionStorage.setItem('dictionary', JSON.stringify({ unique: uniqueList }));
    } else missed.add(coin.baseCcy);
  });

  return (
    <div>
      <h2>Coin List Test</h2>
      <div>Unique: {unique.length}</div>
      {unique.length && (
        <ul className="flex flex-wrap list-none gap-4">
          {unique.map((coin: string) => (
            <li key={coin}>{coin}</li>
          ))}
        </ul>
      )}
      <div>Dupes: {dupes.size}</div>
      {dupes.size && (
        <ul className="flex flex-wrap list-none gap-4">
          {[...dupes].map((coin: string) => (
            <li key={coin}>{coin}</li>
          ))}
        </ul>
      )}
      <div>Missed: {missed.size}</div>
      {missed.size && (
        <ul className="flex flex-wrap list-none gap-4">
          {[...missed].map((coin: string) => (
            <li key={coin}>{coin}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
