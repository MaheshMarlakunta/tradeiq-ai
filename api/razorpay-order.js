export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { amount } = req.body;
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100, currency: "INR", receipt: `receipt_${Date.now()}` })
    });
    const order = await response.json();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
