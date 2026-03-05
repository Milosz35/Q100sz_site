export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ detail: "Method Not Allowed" });
  }

  try {
    const { name = "", email = "", message = "", company = "" } = req.body || {};

    // honeypot: boty często uzupełniają ukryte pole
    if (company) return res.status(200).json({ ok: true });

    if (!message || String(message).trim().length < 3) {
      return res.status(400).json({ detail: "Wiadomość jest zbyt krótka." });
    }

    const to = process.env.MAIL_TO;              
    const from = process.env.MAIL_FROM;         
    const apiKey = process.env.RESEND_API_KEY;   

    if (!to || !from || !apiKey) {
      return res.status(500).json({ detail: "Brak konfiguracji maila na serwerze." });
    }

    const payload = {
      from,
      to: [to],
      reply_to: email ? [email] : undefined,
      subject: `Wiadomość ze strony: ${name || "Anonim"}`,
      text:
        `Imię: ${name}\n` +
        `Email: ${email}\n\n` +
        `Wiadomość:\n${message}\n`,
    };

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return res.status(500).json({ detail: data?.message || "Nie udało się wysłać maila." });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ detail: "Błąd serwera." });
  }
}