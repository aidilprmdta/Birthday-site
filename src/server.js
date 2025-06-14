import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors"; // Tambahkan ini juga!

dotenv.config();

const app = express();

app.use(cors());         // ✅ Setelah app dibuat!
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

console.log('BOT TOKEN:', TELEGRAM_BOT_TOKEN);
console.log('CHAT ID:', TELEGRAM_CHAT_ID);

app.post("/api/send-wish", async (req, res) => {
  const { wish } = req.body;
  console.log("Menerima wish:", wish);

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `🎂 Pesan Ulang Tahun Baru:\n${wish}`,
      }),
    });

    const data = await response.json();
    console.log(data); // Lihat respon dari Telegram

    if (!response.ok) {
      throw new Error(`Telegram error: ${JSON.stringify(data)}`);
    }

    res.status(200).json({ message: "Pesan terkirim ke Telegram!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengirim pesan." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
