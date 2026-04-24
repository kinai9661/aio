# Aqua Image Studio - Vercel Deployment Guide

## Quick Deploy

1. Download `aqua-image-studio-vercel.zip`
2. Extract and upload to GitHub (or use Vercel CLI)
3. Connect to Vercel
4. Set environment variable: `AQUA_API_KEY` = `aqua_sk_24dd0b35d58c407685912dd7ed1fe5cd`
5. Deploy!

## Environment Variables

| Variable | Value |
|----------|-------|
| AQUA_API_KEY | `` |

## Features

- ⚡ 6 AI Models: Flux 2, GPT Image 2, Imagen 4, NanoBanana, ZImage, Midjourney 7
- 📐 5 Aspect Ratios: 1:1, 9:16, 16:9, 3:4, 4:3
- 🔢 Generate 1-4 images at once
- 💾 Download & Regenerate
- 🌙 Dark professional theme

## Project Structure

```
├── api/
│   └── generate.ts      # Serverless API function
├── src/
│   ├── components/      # UI components
│   ├── pages/
│   │   └── ImageStudio.tsx  # Main app page
│   └── App.tsx          # Router setup
├── vercel.json         # Vercel config
├── package.json
└── tailwind.config.js
```
