exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!token || !chatId) {
      return { statusCode: 500, body: "Missing Telegram env vars" };
    }

    const payload = JSON.parse(event.body || "{}");
    const phone = String(payload.phone || "").trim();
    const source = String(payload.source || "landing_form").trim();

    if (!phone) {
      return { statusCode: 400, body: "Phone is required" };
    }

    const text = [
      "🔥 Новий лід з сайту",
      `📞 Телефон: ${phone}`,
      `📍 Джерело: ${source}`,
      `🕒 Час: ${new Date().toISOString()}`,
    ].join("\n");

    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      return { statusCode: 502, body: errText };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message || "Internal error" };
  }
};
