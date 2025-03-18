const express = require("express");
const axios = require("axios");
const app = express();

// Token Verifikasi untuk Webhook Meta
const VERIFY_TOKEN = "CmAKHAjRxOe4rcXEAhIGZW50OndhIgN2cnhQtc3nvgYaQE7CJIacx3y9FQgdUzvBqf1v47AKmpFgNaPkBBUj8TP7W+edb+IsyJb2jkujmGGwPJ1A0e72blYGFULqUziqJgISLm03XcfilI7U81q1tJqkbCicWOblVcfYqIsrP06tPJrh/ZONecZNclCXXiy9BSA=";

// Token & Chat ID Telegram (ganti dengan milik Anda)
const TELEGRAM_BOT_TOKEN = "7739949975:AAE5zEOZdMGi4paSUUe_cMmIGLxcU15HxJ4";
const TELEGRAM_CHAT_ID = "7923815784";

app.use(express.json());

// Endpoint untuk Verifikasi Webhook Meta
app.get("/webhook/whatsapp", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Endpoint untuk menerima pesan WhatsApp
app.post("/webhook/whatsapp", async (req, res) => {
    console.log("Pesan masuk:", JSON.stringify(req.body, null, 2));

    if (req.body.entry) {
        let data = req.body.entry[0].changes[0].value.messages;
        if (data && data.length > 0) {
            let text = data[0].text.body;
            let from = data[0].from;

            // Kirim pesan ke Telegram
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: `Pesan baru dari ${from}: ${text}`
            });
        }
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
