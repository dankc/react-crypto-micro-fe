import dictionary from '../data/coingecko-master-list.json';

export default function DictionaryTest() {
  const unique = [];
  const missed = new Set();
  const dupes = new Set();
  const uniqueList = [];
  const dupeList = [];
  const coinList = JSON.parse(sessionStorage.getItem('coinList'));
  dictionary.forEach((item, index) => {
    // if (!unique.some((s) => s === item.symbol)) unique.push(item.symbol); // 13138 unique symbols
    // else dupeLists.push(item.symbol); // 4120 coins share the same symbol
    // else dupes.add(item.symbol); // 2229 unique duplicate symbols
    if (coinList.some((coin) => coin.baseCcy === item.symbol.toUpperCase())) {
      if (!unique.some((s) => s === item.symbol)) {
        unique.push(item.symbol);
        uniqueList.push(item);
      } else {
        dupes.add(item.symbol);
        dupeList.push(item);
      }
    }
    // else missed.add(item.symbol);
    // if (index === dictionary.length - 1)
    //   sessionStorage.setItem('dictionary', JSON.stringify({ unique: uniqueList, dupes: dupeList }));
  });

  return (
    <div>
      <h2>Dictionary Test</h2>
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
      {/*<div>Missed: {missed.size}</div>*/}
      {/*{missed.size && (*/}
      {/*  <ul className="flex flex-wrap list-none gap-4">*/}
      {/*    {[...missed].map((coin: string) => (*/}
      {/*      <li key={coin}>{coin}</li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*)}*/}
    </div>
  );
}
