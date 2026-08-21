# CineGraph — CognoDB Graph Database Application

CineGraph is a movie discovery application built for the Wexa AI CognoDB take-home assignment.

It demonstrates:
- A graph data model with Movie, Actor, Director, Genre and Studio nodes
- Typed relationships and node properties
- Realistic seed data loaded with a script
- Parameterised Cypher queries using the official Neo4j JavaScript driver
- Multi-hop graph traversals
- Graph-based movie recommendations
- Search and movie relationship exploration
- Loading, empty and error states
- Environment-based database credentials

## Architecture

```text
Next.js + Tailwind
        |
        | REST API
        v
NestJS Backend
        |
        | Official Neo4j JavaScript Driver
        v
CognoDB (Bolt / openCypher)
```

## Graph model

```text
(:Actor)-[:ACTED_IN]->(:Movie)<-[:DIRECTED]-(:Director)
                         |
                         +--[:HAS_GENRE]--> (:Genre)
                         |
                         +--[:PRODUCED_BY]--> (:Studio)
```

## Why a graph database?

The interesting part of a movie catalogue is not only the movie row itself; it is the network around it. A movie can connect to many actors, a director, genres and a studio, while actors and directors connect that movie to many other movies.

A relational design can represent the same information, but relationship-heavy questions require repeated joins across several junction tables. In CineGraph, those questions are expressed naturally as graph traversals. For example, recommendations can follow:

`Movie -> Actor -> Movie`

or:

`Movie -> Actor -> Movie -> Genre`

This makes multi-hop relationship exploration the central part of the application rather than an afterthought.

## Main graph queries

### Find a movie

```cypher
MATCH (m:Movie {id: $movieId})
RETURN m
```

### Find actors in a movie

```cypher
MATCH (m:Movie {id: $movieId})<-[:ACTED_IN]-(a:Actor)
RETURN a
ORDER BY a.name
```

### Multi-hop recommendations through shared actors

```cypher
MATCH (m:Movie {id: $movieId})
      <-[:ACTED_IN]-(a:Actor)
      -[:ACTED_IN]->(related:Movie)
WHERE m <> related
RETURN related, COUNT(DISTINCT a) AS sharedActors
ORDER BY sharedActors DESC
LIMIT 10
```

### Multi-hop recommendations through actors and genres

```cypher
MATCH (m:Movie {id: $movieId})
      <-[:ACTED_IN]-(a:Actor)
      -[:ACTED_IN]->(related:Movie)
      -[:HAS_GENRE]->(g:Genre)
      <-[:HAS_GENRE]-(m)
WHERE m <> related
RETURN related,
       COUNT(DISTINCT a) AS sharedActors,
       COUNT(DISTINCT g) AS sharedGenres
ORDER BY sharedActors DESC, sharedGenres DESC
LIMIT 10
```

## Project structure

```text
cinegraph-cognodb/
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── neo4j.service.ts
│   │   ├── movies/
│   │   │   ├── movies.controller.ts
│   │   │   ├── movies.service.ts
│   │   │   └── movies.module.ts
│   │   └── health/
│   │       ├── health.controller.ts
│   │       └── health.module.ts
│   ├── seed/
│   │   └── seed.ts
│   ├── queries/
│   │   └── recommendations.cypher
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── movies/[id]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── MovieCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── LoadingState.tsx
│   ├── lib/api.ts
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.example
├── .gitignore
└── README.md
```

## 1. Create CognoDB

Create a free CognoDB Cloud instance from the CognoDB console.

Save:
- Bolt URI
- username: `cognodb`
- generated password

The password is displayed only once according to the assignment, so save it immediately.

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Set:

```env
COGNODB_URI=bolt+s://db-76cf5cd8.bravo.databases.cognodb.com
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=75091ede0eeabc179112d8c2a47f2ec6
PORT=4000
FRONTEND_URL=http://localhost:3000
```

Seed the database:

```bash
npm run seed
```

Start the API:

```bash
npm run start:dev
```

API:
`http://localhost:4000`

Health check:
`http://localhost:4000/health`

## 3. Frontend setup

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Run:

```bash
npm run dev
```

Open:

`http://localhost:3000`

## API endpoints

- `GET /health`
- `GET /movies?limit=12`
- `GET /movies/:id`
- `GET /movies/:id/actors`
- `GET /movies/:id/connections`
- `GET /movies/:id/recommendations`
- `GET /search?q=dark&limit=20`

## Environment variables

Never commit `.env` or `.env.local`.

Only commit `.env.example`.

## Deployment

Deploy the backend and frontend separately on free hosting that supports Node.js applications.

Set the same environment variables in the hosting provider:
- Backend: `COGNODB_URI`, `COGNODB_USERNAME`, `COGNODB_PASSWORD`, `FRONTEND_URL`
- Frontend: `NEXT_PUBLIC_API_URL`

Keep the CognoDB instance running while the assessment is being evaluated.

## Demo flow for screen recording

1. Open the CineGraph home page.
2. Search for a movie.
3. Open a movie detail page.
4. Show the actors, director, genre and studio.
5. Scroll to graph-based recommendations.
6. Explain that recommendations traverse Movie -> Actor -> Movie.
7. Show the GitHub repository and README.
8. Briefly show the seed script and Cypher query.

## Security notes

- Credentials are loaded only from environment variables.
- No database password is stored in source code.
- Cypher uses parameters instead of string concatenation.
- Database errors are caught and returned as safe API errors.
