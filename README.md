# VibeCon

VibeCon is a music recommendation web application that analyzes your listening habits and suggests tracks based on your “vibe.”

The project consists of:

- **Frontend**: A Next.js web application in the root folder (`src/`, `public/`).
- **Backend API**: A FastAPI service located in the `api/` directory.
- **Recommender**: Neural network models and training code in the `recommender/` directory.
- **Data**: Dataset and helper scripts in the `data/` directory.

## Repository Structure

```plaintext
.
├── api/           # FastAPI backend
├── data/          # Datasets and TypeScript data helpers
├── public/        # Static assets for the frontend
├── recommender/   # Neural network models and training code
├── src/           # Next.js frontend source code
├── package.json   # Frontend dependencies and scripts
└── README.md      # This file
```

## Frontend (Web App)

### Prerequisites

- Node.js (v18+) and npm (or Yarn, pnpm, bun)

### Install & Run

```bash
npm install
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Backend (API)

The backend API is in the `api/` directory. See [api/README.md](api/README.md) for setup and running instructions.

## Full-stack Development

To run both the frontend and backend concurrently:

```bash
npm run dev
```

This will start the Next.js app on port 3000 and the FastAPI server on port 8000.

## Build & Production

### Build Frontend

```bash
npm run build
```

### Start Frontend

```bash
npm start
```

## Lint & Format

```bash
npm run lint
```

## Contributing

Contributions welcome! Feel free to open issues or submit pull requests.