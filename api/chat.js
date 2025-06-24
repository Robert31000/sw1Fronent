import OpenAI from "openai";

export default async function handler(req, res) {
  // Sólo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Inicializa el cliente en el serverless
  const openai = new OpenAI({ apiKey: process.env.GOOGLE_API_KEY });

  try {
    const { model, messages } = req.body;
    const response = await openai.chat.completions.create({
      model,
      messages
    });
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en chat API:", error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno" });
  }
}
