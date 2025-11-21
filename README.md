### This is a simple web app that checks a PDF against 3 user-provided rules using an LLM.

The project includes:

A React frontend

A Node.js/Express backend

PDF text extraction

LLM evaluation using OpenRouter

How It Works

Upload any PDF (2–10 pages).

Enter 3 rules you want to check.

The backend extracts text from the PDF.

The backend sends the text and rules to an LLM.

The LLM returns pass/fail for each rule, evidence, reasoning, and a confidence score.

Results are shown in a simple table.


Folder Structure
project/
  frontend/
    (React app)
  backend/
    index.js
    package.json
    .env
    uploads/

Frontend Setup
cd frontend
npm install
npm start


Backend Setup
cd backend
npm install


Create a .env file inside the backend folder:

OPENROUTER_API_KEY=your_key_here
PORT=5000

Frontend runs on:

http://localhost:5173



Start the backend:

node index.js


Backend runs on:

http://localhost:5000

Backend Technologies Used

Node.js

Express

Multer (file upload)

pdfreader (PDF text extraction)

@openrouter/sdk (LLM API)

dotenv

CORS

Frontend Technologies Used

React

Axios

Example Rule Input

“The document must have a purpose section.”

“The document must mention a date.”

“The document must define at least one term.”

Example Output (from backend)
[
  {
    "rule": "Document must mention a date.",
    "status": "pass",
    "evidence": "Found in page 1: 'Published 2024'",
    "reasoning": "The PDF contains a year reference.",
    "confidence": 92
  }
]

Notes

This project uses OpenRouter, refer here (https://openrouter.ai/)

The model used is: google/gemini-2.0-flash-001.

The .env file must not contain quotes around the API key.

Running the Full App

Start backend

Start frontend

Visit http://localhost:5173

Upload a PDF

Enter 3 rules

Press "Check Document" button, the resuls/output will be shown below
