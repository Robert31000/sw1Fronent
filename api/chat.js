import OpenAI from "openai";

export default async function handler(req, res) {
  console.log("🔔 /api/chat invoked", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Asegúrate de tener la variable en Vercel
  if (!process.env.GOOGLE_API_KEY) {
    console.error("❌ Falta GOOGLE_API_KEY");
    return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });
  }

  const openai = new OpenAI({ apiKey: process.env.GOOGLE_API_KEY });

  try {
    const { model, messages } = req.body;
    const response = await openai.chat.completions.create({ model, messages });
    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ OpenAI error:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno" });
  }
}
