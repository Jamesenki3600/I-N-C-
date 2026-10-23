import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for the Vanguard ZERO Tactician chatbot
const SYSTEM_INSTRUCTION = `You are "Capital AI", an enthusiastic, deeply knowledgeable Cardfight!! Vanguard ZERO battle tactician and Card Capital assistant.
Your expertise is specifically focused on Cardfight!! Vanguard ZERO (the mobile adaptation terminated in 2023) and general Vanguard lore and mechanics.

Key Knowledge & Mechanics you should explain accurately:
1. 40-Card Deck Construction: Exactly 1 First Vanguard (starter), 13 Grade 1s, 13 Grade 2s, and 13 Grade 3s.
2. Grade 3 Trigger Allocation: In Zero, triggers are assigned to Grade 3 units. Exactly 4 Heal triggers are required, and the other 9 slots can be allocated to Critical, Draw, or Stand triggers.
3. The Intercept Rule: All Grade 2 units have Intercept. When placed on the front row rear-guard circles, opponents CANNOT target the Vanguard! Opponents must attack and eliminate front-row Interceptors first.
4. Auto-Sentinels (Perfect Guards): Hand guarding was removed in Zero. Instead, Sentinels (Flash Shield Iseult, Wyvern Guard Barri, Dark Shield Mac Lir, Battle Sister Chocolat) activate automatically from hand when the Vanguard would receive lethal (at 5 damage) or heavy 2+ damage!
5. Twin Drive: Grade 3 Vanguard performs 2 Drive Checks on attack.
6. Key Clans & Cards:
   - Royal Paladin (Aichi Sendou): Blaster Blade (CB2 retire), King of Knights Alfred (power boost per rear-guard), Soul Saver Dragon (Holy Charging Roar +5000 to 3 units).
   - Kagero (Toshiki Kai): Dragonic Overlord (CB3 restand on rear-guard hit), Berserk Dragon (CB2 retire), Barri.
   - Shadow Paladin (Ren Suzugamori): Phantom Blaster Dragon (CB2 retire 3 rear-guards for +10k & +1 crit), Blaster Dark, Nemain.
   - Oracle Think Tank (Misaki Tokura): CEO Amaterasu (scry & soul charge, hand size power boost), Silent Tom (unblockable attacks against rested units).

Tone & Persona:
- Passionate, knowledgeable, friendly, and anime-spirited ("Stand up, THE Vanguard!").
- Give clear, concise, actionable tactical advice for card choices, mulligans, trigger spreads, and intercept management.
- Format responses cleanly with bolding and bullet points for legibility. Keep explanations focused and easy to read during a game.`;

// API endpoint for chatbot
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, currentGameState } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    // If Gemini API client is available and key is configured
    if (ai && apiKey) {
      // Build contents array for Gemini
      const conversationContents = messages.map((m: { role: 'user' | 'assistant'; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Add context if available
      let systemPromptWithContext = SYSTEM_INSTRUCTION;
      if (currentGameState) {
        systemPromptWithContext += `\n\n[Current Live Duel State]: ${JSON.stringify(currentGameState)}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationContents,
        config: {
          systemInstruction: systemPromptWithContext,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Stand up, THE Vanguard! I'm here to help you master the battle.";
      res.json({ reply: replyText });
      return;
    }

    // Built-in intelligent fallback when API key is not configured in environment
    const userQuery = (messages[messages.length - 1]?.content || '').toLowerCase();
    let fallbackReply = '';

    if (userQuery.includes('intercept') || userQuery.includes('guard') || userQuery.includes('shield')) {
      fallbackReply = `**The Vanguard ZERO Intercept Barrier** is the cornerstone of defense!\n\n• **Front-Row Shielding**: Every Grade 2 unit possesses the **Intercept** skill. When stationed on your Front-Left or Front-Right circles, your opponent **cannot target your Vanguard**—they are forced to attack the Interceptors first!\n• **Retire Synergies**: Kagero (Berserk Dragon / Dragonic Overlord) and Royal Paladin (Blaster Blade) specialize in retiring opponent Interceptors via Counter Blast to clear a path to the Vanguard.\n• **Sentinels (Perfect Guards)**: Unlike the physical card game where you guard from hand, in Zero Sentinels deploy automatically from your hand when receiving lethal damage at 5 damage!`;
    } else if (userQuery.includes('trigger') || userQuery.includes('heal') || userQuery.includes('crit')) {
      fallbackReply = `**Vanguard ZERO Trigger Construction Strategy**:\n\n• **Assigned to Grade 3s**: Triggers aren't Grade 0 cards in Zero—they are bound to your 13 Grade 3 slots!\n• **Mandatory 4 Heals**: Every tournament deck must run exactly 4 Heal Triggers. (Remember: Heal only restores damage if your damage is ≥ opponent's damage).\n• **Recommended Spreads**:\n  - **5 Draw / 4 Crit / 4 Heal**: The standard balanced meta spread. Keeps your hand replenished to ensure you draw your Grade 1 Sentinels!\n  - **9 Crit / 4 Heal**: Aggressive high-tempo spread for Phantom Blaster Dragon or Royal Paladins to push early lethal before opponents can assemble defenses!`;
    } else if (userQuery.includes('deck') || userQuery.includes('build') || userQuery.includes('ratio')) {
      fallbackReply = `**Authentic ZERO 40-Card Deck Ratios**:\n\n• **1 First Vanguard (Grade 0)**: Moves to rear-guard upon riding Grade 1.\n• **13 Grade 1 Units**: 4 Sentinels (Flash Shield Iseult, Barri, etc.) + 9 Boosters (8k attackers or searchers).\n• **13 Grade 2 Units**: Your front-row Interceptors (e.g. Blaster Blade, Nehalem, Gallatin).\n• **13 Grade 3 Units**: Your boss units & trigger holders (Alfred, Overlord, Amaterasu, PBD).\n\nYou can customize your deck and trigger allocations anytime in the **Deck Customizer** tab!`;
    } else if (userQuery.includes('royal') || userQuery.includes('blaster blade') || userQuery.includes('alfred')) {
      fallbackReply = `**Royal Paladin Strategy**: Focuses on superior calls and swarm power! King of Knights Alfred gains +2,000 Power for every Royal Paladin rear-guard you control (up to 20,000 unboosted!). Use Blaster Blade's Counter Blast 2 to snipe opponent Grade 2 Interceptors so Alfred can land direct hits with Twin Drive!`;
    } else if (userQuery.includes('kagero') || userQuery.includes('overlord') || userQuery.includes('kai')) {
      fallbackReply = `**Kagero Strategy**: Dominates through field control! Berserk Dragon retires enemy rear-guards for CB2. When you ride Dragonic Overlord, its skill allows it to restand after hitting an opponent's rear-guard for CB3—wiping out both enemy Interceptors in one turn and still hitting the Vanguard!`;
    } else {
      fallbackReply = `Stand up, THE Vanguard! Welcome to **Card Capital**! I am your AI Tactician for the Vanguard ZERO Revival.\n\nAsk me anything about:\n• **Zero Rules** (Intercepts, Auto-Sentinels, 40-card ratios)\n• **Trigger Configurations** (Heal, Draw, Critical allocations)\n• **Clan Guides** (Royal Paladin, Kagero, Shadow Paladin, Oracle Think Tank)\n• **Matchup Tactics** (How to breach defensive walls and manage Counter Blast)`;
    }

    res.json({ reply: fallbackReply });
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    const errMessage = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ error: errMessage });
  }
});

// Production vs Dev setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Vanguard Zero Revival server listening at http://0.0.0.0:${port}`);
  });
}

startServer();
