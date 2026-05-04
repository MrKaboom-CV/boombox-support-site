import express from 'express';

// --- Logic migrated from boombox-app/supabase/functions/identify-card/index.ts ---
async function fetchEbayComps(searchQuery: string) {
  try {
    // Adapted for Node.js environment
    const apiKey = process.env.EBAY_API_KEY;
    const safeQuery = `${searchQuery} -proxy -custom -digital -read -reprint -art -empty -patch`;
    let prices: number[] = [];

    if (apiKey) {
      console.log("🚀 USING OFFICIAL EBAY API");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      
      const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=${apiKey}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${encodeURIComponent(safeQuery)}&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true&paginationInput.entriesPerPage=10`;
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`eBay API Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      const items = data.findCompletedItemsResponse?.[0]?.searchResult?.[0]?.item || [];
      
      prices = items.map((item: any) => {
        const val = parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__);
        return val;
      }).filter((val: number) => !isNaN(val) && val > 0);

    } else {
      console.log("🕵️ USING STEALTH SCRAPER (API Key Not Found)");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(safeQuery)}&LH_Sold=1&LH_Complete=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        signal: controller.signal
      });
      const html = await res.text();
      clearTimeout(timeoutId);
      
      const chunks = html.split('class="s-item__price">');
      
      for (let i = 2; i < Math.min(chunks.length, 8); i++) {
        const chunk = chunks[i];
        const endIdx = chunk.indexOf('</span>');
        if (endIdx > -1) {
          const priceStr = chunk.substring(0, endIdx);
          const match = priceStr.match(/\$([0-9,.]+)/);
          if (match) {
            const val = parseFloat(match[1].replace(/,/g, ''));
            if (!isNaN(val) && val > 0) prices.push(val);
          }
        }
      }
    }
    
    if (prices.length === 0) return 0;
    
    prices.sort((a, b) => a - b);

    let validPrices = prices;
    if (prices.length >= 4) {
      validPrices = prices.slice(1, prices.length - 1);
    }
    
    const total = validPrices.reduce((sum, price) => sum + price, 0);
    return Math.round((total / validPrices.length) * 100) / 100;
  } catch (e) {
    console.error("eBay Scrape Error:", e);
    return 0;
  }
}
// --- End of migrated logic ---

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('IronsIDE eBay Market Data Engine - ONLINE');
});

app.get('/comps', async (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required and must be a string.' });
  }
  
  const value = await fetchEbayComps(query);
  res.json({ query, value, status: 'success' });
});

app.listen(port, () => {
  console.log(`[server]: Market Data Engine is running at http://localhost:${port}`);
});