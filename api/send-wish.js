// File: /api/sendMessage.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    const telegramToken = process.env.BOT_TOKEN;
    const telegramChatId = process.env.CHAT_ID;

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
        }),
      });

      const data = await response.json();
      res.status(200).json({ ok: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: error.message });
    }
  } else {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
}
