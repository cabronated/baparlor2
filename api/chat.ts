import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contents, toolConfig } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, ...toolConfig })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Google API Error:', errorText);
        return res.status(response.status).json({ error: 'Failed to communicate with AI', details: errorText });
    }
    
    const data = await response.json();
    res.json(data);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to communicate with AI' });
  }
}
