import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { PdfReader } from "pdfreader";
import { OpenRouter } from "@openrouter/sdk";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "PDF-Rule-Checker",
  },
});

const BASE_PROMPT = `
You are an AI system that evaluates a PDF document based on user-provided rules.

For each rule:
- Return pass/fail
- Provide evidence from the PDF
- Provide short reasoning
- Provide confidence (0-100)

Return ONLY a JSON array.
`;

function extractPdfText(path) {
  return new Promise((resolve, reject) => {
    const reader = new PdfReader();
    let text = "";

    reader.parseFileItems(path, (err, item) => {
      if (err) return reject(err);
      if (!item) return resolve(text);
      if (item.text) text += item.text + " ";
    });
  });
}

app.post("/check", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const rules = JSON.parse(req.body.rules);

    const documentText = await extractPdfText(req.file.path);

    const finalPrompt = `
${BASE_PROMPT}

Document Text:
${documentText}

Rules:
${JSON.stringify(rules)}
`;

    const completion = await openRouter.chat.send({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      stream: false,
    });

    const raw = completion.choices[0].message.content;

    const clean = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const results = JSON.parse(clean);

    fs.unlinkSync(req.file.path);

    res.json({ results });
  } catch (err) {
    console.error("ERR:", err);
    res.status(500).json({
      error: "Failed to process document",
      details: err.message,
    });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
