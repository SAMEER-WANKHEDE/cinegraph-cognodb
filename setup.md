# Quick setup

## Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your CognoDB credentials
npm run seed
npm run start:dev
```

## Frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Important

Do not commit `.env` or `.env.local`.
