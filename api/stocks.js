export default async function handler(req, res) {
  try {
    const symbols = [
      "^NSEI", "^BSESN", "RELIANCE.NS", "TCS.NS",
      "HDFCBANK.NS", "INFY.NS", "SBIN.NS",
      "COALINDIA.NS", "SUNPHARMA.NS", "TATASTEEL.NS",
      "WIPRO.NS", "CEATLTD.NS"
    ].join(",");

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const data = await response.json();
    const quotes = data.quoteResponse.result.map(q => ({
      s: q.symbol === "^NSEI" ? "NIFTY 50" :
         q.symbol === "^BSESN" ? "SENSEX" :
         q.symbol.replace(".NS","").replace(".BO",""),
      p: q.regularMarketPrice?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "—",
      c: q.regularMarketChangePercent
         ? (q.regularMarketChangePercent >= 0 ? "+" : "") +
           q.regularMarketChangePercent.toFixed(2) + "%"
         : "—",
      up: (q.regularMarketChangePercent || 0) >= 0
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(200).json(quotes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
