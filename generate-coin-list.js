import fs from 'fs';
import top1kList from './src/data/coins-top-1k.json' with { type: 'json' };

const outDir = './src/data';

// Generate dictionary file of OKX coins against CoinGecko data for display names and images
async function generateDict() {
  const okxData = await fetch('https://www.okx.com/api/v5/public/instruments?instType=SPOT', {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  });
  const unique = [];
  const uniqueList = [];
  const json = await okxData.json();
  const allCoins = json.data;
  allCoins.forEach((coin, index) => {
    const dictionaryEntry = top1kList.find((item) => coin.baseCcy === item.symbol.toUpperCase());
    if (dictionaryEntry) {
      if (!unique.some((s) => s === coin.baseCcy)) {
        unique.push(coin.baseCcy);
        uniqueList.push({ name: dictionaryEntry.name, symbol: dictionaryEntry.symbol.toUpperCase(), id: dictionaryEntry.id, logo: dictionaryEntry.image });
      }
    }
    if( index === allCoins.length - 1 ) {
      console.log('writing file')
      fs.writeFile(`${outDir}/coin-dictionary.json`, JSON.stringify(uniqueList, null, 2), 'utf8', (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
      })
    }
  });
}

generateDict();