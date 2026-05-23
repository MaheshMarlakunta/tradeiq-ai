export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const apiKey = process.env.VITE_ANTHROPIC_KEY;
  if (!apiKey) return res.status(500).json({ content:[{text:"❌ API key missing in Vercel environment variables."}] });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ ...req.body, model: "claude-3-5-haiku-20241022" }),
    });
    const data = await response.json();
    if (data.error) return res.status(200).json({ content:[{text:`❌ Anthropic error: ${data.error.message}`}] });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ content:[{text:`❌ Server error: ${err.message}`}] });
  }
}
