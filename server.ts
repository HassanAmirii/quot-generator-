import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_INSTRUCTION = `You are MoodQuotes AI, a thoughtful and creative quote writer.

Your job is to generate original, emotionally relevant quotes based on the user's current mood.

Guidelines:

1. Generate quotes that directly resonate with the user's selected mood.
2. Make every quote meaningful, memorable and natural.
3. Avoid generic motivational clichés.
4. Do not repeat famous quotes or attribute invented quotes to real people.
5. Keep quotes concise, ideally between 10 and 30 words.
6. Your tone should be empathetic, warm and human.
7. Do not force positivity when the user selects a negative mood.
8. When someone feels sad, lonely, anxious or overwhelmed, acknowledge their feelings rather than dismissing them.
9. When someone feels happy, grateful or confident, create quotes that celebrate those feelings.
10. Every generation should produce a fresh and original quote.
11. Never judge the user's emotional state.
12. Do not present yourself as a therapist or make medical claims.

Return the response in valid JSON with these fields:

{
  "quote": "The generated quote",
  "explanation": "A short explanation of the quote",
  "message": "A short, empathetic message for the user"
}

Do not include Markdown formatting or additional text outside the JSON.`;

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Initialize Google Gen AI
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Quote Generation Endpoint
  app.post('/api/generate-quote', async (req: Request, res: Response) => {
    try {
      const { mood, emoji, previousQuotes } = req.body;

      if (!mood || typeof mood !== 'string') {
        res.status(400).json({ error: 'Please select a valid mood.' });
        return;
      }

      if (!apiKey) {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check your AI Studio Secrets.',
        });
        return;
      }

      let userPrompt = `Selected mood: ${mood} ${emoji || ''}`;
      if (Array.isArray(previousQuotes) && previousQuotes.length > 0) {
        userPrompt += `\n\nNote: The user requested another quote for this mood. They have already seen:\n${previousQuotes
          .slice(-5)
          .map((q: string) => `- "${q}"`)
          .join('\n')}\nPlease create a completely distinct and fresh perspective.`;
      }

      // Priority list of models starting with Gemma 4 as specified in the project requirements
      // with seamless fallbacks to resilient models
      const modelCandidates = [
        'gemma-4-31b-it',
        'gemma-4-26b-a4b-it',
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-flash-latest',
      ];

      let rawText = '';
      let successfulModel = '';
      let lastError: any = null;

      for (const model of modelCandidates) {
        try {
          // Use a 3.5 second timeout for Gemma models if they are stalling or throwing backend internal errors
          const isGemma = model.startsWith('gemma');
          const timeoutMs = isGemma ? 3500 : 15000;
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), timeoutMs);

          const response = await Promise.race([
            ai.models.generateContent({
              model,
              contents: `${SYSTEM_INSTRUCTION}\n\nUser Request:\n${userPrompt}`,
            }),
            new Promise<never>((_, reject) => {
              controller.signal.addEventListener('abort', () =>
                reject(new Error(`Timeout after ${timeoutMs}ms on model ${model}`))
              );
            }),
          ]);

          clearTimeout(timer);

          if (response && response.text) {
            rawText = response.text.trim();
            successfulModel = model;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${model} attempt failed: ${err?.message || err}`);
          // Proceed to next model candidate
        }
      }

      if (!rawText) {
        throw new Error(
          lastError?.message || 'Unable to generate quote from available Google AI models.'
        );
      }

      // Clean markdown code blocks if present
      let cleaned = rawText;
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }

      let parsed: { quote?: string; explanation?: string; message?: string } = {};
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        // Fallback simple regex extraction if JSON had formatting quirks
        const quoteMatch = rawText.match(/"quote"\s*:\s*"([^"]+)"/i);
        const explMatch = rawText.match(/"explanation"\s*:\s*"([^"]+)"/i);
        const msgMatch = rawText.match(/"message"\s*:\s*"([^"]+)"/i);

        if (quoteMatch) {
          parsed = {
            quote: quoteMatch[1],
            explanation: explMatch ? explMatch[1] : '',
            message: msgMatch ? msgMatch[1] : '',
          };
        } else {
          parsed = {
            quote: rawText.replace(/[{}"\n]/g, ' ').trim(),
            explanation: `Reflecting on the feeling of ${mood.toLowerCase()}.`,
            message: `Honor what you are feeling in this moment.`,
          };
        }
      }

      if (!parsed.quote) {
        throw new Error('AI response did not contain a quote.');
      }

      res.json({
        success: true,
        quote: parsed.quote.trim(),
        explanation: parsed.explanation?.trim() || '',
        message: parsed.message?.trim() || '',
        mood,
        emoji: emoji || '',
        model: successfulModel,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error generating quote:', error);
      res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to generate quote. Please check your connection and try again.',
      });
    }
  });

  // Serve Vite in dev or static files in production
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = fs.existsSync(path.resolve(__dirname, 'dist'))
    ? path.resolve(__dirname, 'dist')
    : path.resolve(__dirname, '../dist');

  if (isProduction && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MoodQuotes server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
