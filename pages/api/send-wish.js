export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Incoming request..."); // Tambah log!
    console.log("BODY:", req.body); // Log body-nya

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log("TOKEN:", TELEGRAM_BOT_TOKEN);
    console.log("CHAT_ID:", TELEGRAM_CHAT_ID);

    const { wish } = req.body;

    try {
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      console.log("Request to:", telegramApiUrl);

      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `🎂 Pesan Ulang Tahun Baru:\n${wish}`,
        }),
      });

      const data = await response.json();
      console.log("Telegram Response:", data);

      if (!response.ok) throw new Error(JSON.stringify(data));

      res.status(200).json({ message: "Terkirim ke Telegram!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
