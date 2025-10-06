# Generative AI Samples

A Next.js application showcasing various generative AI capabilities and integrations.

## Features

- **Translation** - Translate text between languages
- **Transcription** - Convert audio to text
- **Voice Synthesis** - Generate speech from text
- **Chat** - Interactive AI conversation
- **PDF Reader** - Analyze and chat with PDF documents
- **Image Operations** - AI-powered image manipulation
- **Imagine** - Generate images from text descriptions

## Getting Started

First, install dependencies:

```bash
npm install
```

Create a `.env` file from the example and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `OPENAI_API_KEY` - Get from [OpenAI](https://platform.openai.com/api-keys)
- `HF_APIKEY` - Get from [Hugging Face](https://huggingface.co/settings/tokens)
- `XI_API_KEY` - Get from [ElevenLabs](https://elevenlabs.io/app/settings/api-keys)
- `QDRANT_URL` - Optional, defaults to `http://localhost:6333`

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **[LangChain](https://langchain.com)** - AI orchestration framework
- **[OpenAI](https://openai.com)** - GPT-4 for chat & translation, Whisper for transcription, text-embedding-3-small for embeddings
- **[Hugging Face](https://huggingface.co)** - Stable Diffusion XL for image generation, DETR for object detection
- **[ElevenLabs](https://elevenlabs.io)** - Voice synthesis
- **[Qdrant](https://qdrant.tech)** - Vector database for PDF search
- **[Next.js](https://nextjs.org)** - React framework
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
