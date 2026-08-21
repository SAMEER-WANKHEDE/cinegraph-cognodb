CineGraph — CognoDB Graph Database Application

CineGraph is a movie discovery and relationship exploration application built for the Wexa AI CognoDB Take-Home Assignment.

The application demonstrates how a graph database can be used to model and explore relationships between movies, actors, directors, genres and studios.


==================================================
FEATURES
==================================================

- Movie catalogue with ratings, release year and duration
- Movie poster images
- Movie detail pages
- Search for movies, actors and directors
- Actor relationships
- Director relationships
- Genre relationships
- Studio relationships
- Graph-based movie recommendations
- Multi-hop graph traversal
- Loading, empty and error states
- Responsive user interface
- Environment-based database configuration
- Parameterised Cypher queries
- Graceful database error handling


==================================================
WHY A GRAPH DATABASE?
==================================================

A movie application is naturally relationship-heavy.

A movie can have:

- Multiple actors
- A director
- Multiple genres
- A production studio

At the same time, an actor can appear in many movies, a director can direct multiple movies, and movies can share multiple genres.

A relational database can represent this information using multiple tables and junction tables. However, queries involving several relationships require repeated joins.

In CineGraph, these relationships can be explored naturally using graph traversals.

For example:

Movie -> Actor -> Movie

This allows the application to find other movies that share actors with the selected movie.

The application also supports more complex traversals such as:

Movie -> Actor -> Movie -> Genre

This makes relationship-based movie discovery the central part of the application rather than simply filtering rows by individual movie properties.

The graph database therefore provides a natural way to represent and query the connected movie ecosystem.


==================================================
ARCHITECTURE
==================================================

                         +----------------------+
                         |      Next.js UI      |
                         |   React + Tailwind   |
                         +----------+-----------+
                                    |
                                    | REST API
                                    v
                         +----------------------+
                         |    NestJS Backend    |
                         | Controllers/Services |
                         +----------+-----------+
                                    |
                                    | Neo4j Driver
                                    | Bolt / openCypher
                                    v
                         +----------------------+
                         |       CognoDB        |
                         |    Graph Database    |
                         +----------------------+


==================================================
GRAPH DATA MODEL
==================================================

CineGraph uses five main node types:

- Movie
- Actor
- Director
- Genre
- Studio

Relationships:

Actor      -[ACTED_IN]->      Movie

Director   -[DIRECTED]->      Movie

Movie      -[HAS_GENRE]->     Genre

Movie      -[PRODUCED_BY]->   Studio


Overall graph:

                         Actor
                           |
                        ACTED_IN
                           |
                           v
Director ----DIRECTED--> Movie ----HAS_GENRE----> Genre
                           |
                           |
                      PRODUCED_BY
                           |
                           v
                         Studio


Example:

Christopher Nolan
        |
     DIRECTED
        |
        v
     Inception
      /  |  \
     /   |   \
  Actor Genre Studio


==================================================
DATA MODEL
==================================================

Movie properties:

- id
- title
- releaseYear
- rating
- duration
- description
- posterUrl

Actor properties:

- id
- name

Director properties:

- id
- name

Genre properties:

- id
- name

Studio properties:

- id
- name


==================================================
TECHNOLOGY STACK
==================================================

Frontend:

- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:

- NestJS
- TypeScript
- REST API

Database:

- CognoDB
- openCypher
- Bolt protocol
- Official Neo4j JavaScript driver


==================================================
PROJECT STRUCTURE
==================================================

cinegraph-cognodb/

├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   │
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── neo4j.service.ts
│   │   │
│   │   ├── movies/
│   │   │   ├── movies.controller.ts
│   │   │   ├── movies.service.ts
│   │   │   └── movies.module.ts
│   │   │
│   │   └── health/
│   │       ├── health.controller.ts
│   │       └── health.module.ts
│   │
│   ├── seed/
│   │   └── seed.ts
│   │
│   ├── queries/
│   │   └── recommendations.cypher
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── movies/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── search/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── MovieCard.tsx
│   │   ├── MoviePoster.tsx
│   │   ├── SearchBar.tsx
│   │   └── LoadingState.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── setup.md


==================================================
COGNODB SETUP
==================================================

Create a free CognoDB Cloud instance from:

https://console.cognodb.com/

The free tier does not require a credit card.

After creating the instance, save:

- Bolt URI
- Username
- Generated password

The default username is:

cognodb

The database password must be stored securely and must never be committed to GitHub.


==================================================
BACKEND SETUP
==================================================

Open a terminal:

cd backend

Install dependencies:

npm install

Create the environment file:

cp .env.example .env

Configure the environment:

COGNODB_URI=bolt+s://<your-instance>.databases.cognodb.com
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-password>

PORT=4000

FRONTEND_URL=http://localhost:3000

Do not commit the .env file.


==================================================
SEED THE DATABASE
==================================================

Run:

npm run seed

The seed script creates:

- Movies
- Actors
- Directors
- Genres
- Studios
- Relationships between the nodes

The seed data also includes movie poster URLs.


==================================================
START BACKEND
==================================================

Run:

npm run start:dev

The backend will run at:

http://localhost:4000

Health check:

http://localhost:4000/health


==================================================
FRONTEND SETUP
==================================================

Open another terminal:

cd frontend

Install dependencies:

npm install

Create the environment file:

cp .env.example .env.local

Configure:

NEXT_PUBLIC_API_URL=http://localhost:4000

Start the frontend:

npm run dev

The frontend will run at:

http://localhost:3000


NOTE:

The localhost URLs above are only for local development.

For the final submission, the Live Demo section should contain the deployed application URL.


==================================================
API ENDPOINTS
==================================================

Health:

GET /health


Movies:

GET /movies?limit=12


Movie Details:

GET /movies/:id


Movie Actors:

GET /movies/:id/actors


Movie Connections:

GET /movies/:id/connections


Recommendations:

GET /movies/:id/recommendations


Search:

GET /search?q=inception&limit=20


==================================================
MAIN CYPHER QUERIES
==================================================

Find a movie:

MATCH (m:Movie {id: $movieId})
RETURN m


Find actors in a movie:

MATCH (m:Movie {id: $movieId})
<-[:ACTED_IN]-(a:Actor)

RETURN a
ORDER BY a.name


==================================================
MULTI-HOP RECOMMENDATION
==================================================

One of the main graph queries finds movies that share actors.

MATCH (m:Movie {id: $movieId})
<-[:ACTED_IN]-(a:Actor)
-[:ACTED_IN]->(related:Movie)

WHERE m <> related

RETURN related,
       COUNT(DISTINCT a) AS sharedActors

ORDER BY sharedActors DESC

LIMIT 10


Traversal:

Movie
  |
  v
Actor
  |
  v
Related Movie


This is a multi-hop graph traversal and demonstrates how relationships can be used to discover connected movies.


==================================================
ACTOR + GENRE RECOMMENDATION
==================================================

CineGraph also combines actors and genres.

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


This allows recommendations to consider:

- Shared actors
- Shared genres

The traversal is:

Movie
  |
  v
Actor
  |
  v
Movie
  |
  v
Genre
  ^
  |
Movie


==================================================
PARAMETERISED QUERIES
==================================================

The application uses parameters with the official Neo4j JavaScript driver.

Example:

session.run(
  `
  MATCH (m:Movie {id: $movieId})
  RETURN m
  `,
  {
    movieId,
  },
);


User input is not directly concatenated into Cypher queries.

This keeps the queries structured and avoids unsafe string-built Cypher.


==================================================
USER INTERFACE
==================================================

Home Page:

- Movie catalogue
- Movie posters
- Ratings
- Release years
- Duration
- Navigation to movie details


Search:

Users can search for:

- Movies
- Actors
- Directors
- Other supported graph entities


Movie Details:

The movie detail page displays:

- Movie poster
- Rating
- Release year
- Duration
- Description
- Director
- Studio
- Genres
- Actors


Graph Relationships:

The movie page displays actors connected to the selected movie.


Recommendations:

The application displays graph-based movie recommendations using shared actors and genres.


==================================================
ERROR HANDLING
==================================================

The backend handles database errors and returns safe API responses.

The frontend provides:

- Loading states
- Empty states
- Error states
- Missing relationship handling

If CognoDB is unavailable, the application displays an appropriate error state instead of exposing database credentials or internal database errors.


==================================================
ENVIRONMENT VARIABLES
==================================================

Backend:

COGNODB_URI=
COGNODB_USERNAME=
COGNODB_PASSWORD=
PORT=
FRONTEND_URL=


Frontend:

NEXT_PUBLIC_API_URL=


Actual .env and .env.local files are not committed to GitHub.


==================================================
SECURITY
==================================================

Database credentials are stored only in environment variables.

The following files are ignored:

.env
.env.*
!.env.example

The repository contains only .env.example files.

Never put the real CognoDB password in:

- README
- Source code
- GitHub
- Screenshots
- Screen recordings
- Frontend environment variables


==================================================
DEPLOYMENT
==================================================

The application should be deployed as two services:

1. Backend
2. Frontend


Backend environment variables:

COGNODB_URI=<CognoDB Bolt URI>
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<CognoDB password>
PORT=<hosting provider port>
FRONTEND_URL=<deployed frontend URL>


Frontend environment variable:

NEXT_PUBLIC_API_URL=<deployed backend URL>


The CognoDB instance should remain running while the assignment is being evaluated.


==================================================
LIVE DEMO
==================================================

Frontend:
🌐 Application: https://cinegraph-cognodb.vercel.app/



GitHub:

https://github.com/SAMEER-WANKHEDE/cinegraph-cognodb


==================================================
PRODUCTION BUILD VERIFICATION
==================================================

Backend:

cd backend
npm run build


Frontend:

cd frontend
npm run build




==================================================
SCREENSHOTS
==================================================

images/connected-movies.png

images/home-page.png

images/movie-details.png

images/recommendations.png

images/search.png


==================================================
ASSIGNMENT REQUIREMENTS CHECKLIST
==================================================

Graph database:
YES - CognoDB

Thoughtful graph data model:
YES

Nodes:
Movie, Actor, Director, Genre, Studio

Typed relationships:
YES

Node properties:
YES

Realistic seed data:
YES

Seed script:
YES

Cypher queries:
YES

Multi-hop traversal:
YES

Relationally awkward query:
YES - graph-based recommendations

Parameterised Cypher:
YES

Official Neo4j JavaScript driver:
YES

Functional web application:
YES

Search:
YES

Movie relationship exploration:
YES

Graph recommendations:
YES

Loading states:
YES

Empty states:
YES

Error states:
YES

Environment-based credentials:
YES

Graceful database error handling:
YES

GitHub repository:
YES

Hosted demo:
Yes

Screenshots:
Yes
