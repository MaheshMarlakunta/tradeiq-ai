export default async function handler(req, res) {
  const STOCKS = [
    { s: "NIFTY 50",    y: "^NSEI"        },
    { s: "SENSEX",      y: "^BSESN"       },
    { s: "RELIANCE",    y: "RELIANCE.NS"   },
    { s: "TCS",         y: "TCS.NS"        },
    { s: "HDFC BANK",   y: "HDFCBANK.NS"  },
    { s: "INFY",        y: "INFY.NS"       },
    { s: "SBIN",        y: "SBIN.NS"       },
    { s: "COAL INDIA",  y: "COALINDIA.NS"  },
    { s: "SUN PHARMA",  y: "SUNPHARMA.NS"  },
    { s: "TATA STEEL",  y: "TATASTEEL.NS"  },
    { s: "WIPRO",       y: "WIPRO.NS"      },
    { s: "BAJAJ FIN",   y: "BAJFINANCE.NS" },
  ];

  try {
    const results = await Promise.all(
      STOCKS.map(async ({ s, y }) => {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${y}?interval=1d&range=1d`;
          const r = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
              "Accept": "application/json",
            }
          });
          const data = await r.json();
          const meta = data?.chart?.result?.[0]?.meta;
          if (!meta?.regularMarketPrice) return null;

          const price = meta.regularMarketPrice;
          const prev  = meta.chartPreviousClose || meta.previousClose || price;
          const pct   = ((price - prev) / prev) * 100;

          return {
            s,
            p: price.toLocaleString("en-IN", { maximumFractionDigits: 2 }),
            c: (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%",
            up: pct >= 0,
          };
        } catch { return null; }
      })
    );

    const quotes = results.filter(Boolean);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
    res.status(200).json(quotes.length ? quotes : []);
  } catch {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
}
