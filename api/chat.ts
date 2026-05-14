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

    const payload: any = {
      contents,
    };

    if (toolConfig) {
      if (toolConfig.systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: toolConfig.systemInstruction }]
        };
      }
      if (toolConfig.tools) {
        payload.tools = toolConfig.tools;
      }
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
