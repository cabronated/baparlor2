import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contents, toolConfig } = req.body;
    const response = await fetch("https://generativeai.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, ...toolConfig })
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to communicate with AI' });
  }
}
