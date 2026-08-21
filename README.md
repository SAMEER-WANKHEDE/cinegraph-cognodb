CineGraph — CognoDB Graph Database Application
===============================================

CineGraph is a movie discovery application built for the Wexa AI CognoDB take-home assignment.

It demonstrates:

- A graph data model with Movie, Actor, Director, Genre and Studio nodes
- Typed relationships and node properties
- Realistic seed data loaded with a script
- Parameterised Cypher queries using the official Neo4j JavaScript driver
- Multi-hop graph traversals
- Graph-based movie recommendations
- Movie search
- Movie relationship exploration
- Poster images for movie listings and movie details
- Loading, empty and error states
- Environment-based database credentials


ARCHITECTURE
============

Next.js + Tailwind
        |
        | REST API
        v
NestJS Backend
        |
        | Official Neo4j JavaScript Driver
        v
CognoDB (Bolt / openCypher)


GRAPH MODEL
===========

(Actor)-[:ACTED_IN]->(Movie)<-[:DIRECTED]-(Director)
                         |
                         +--[:HAS_GENRE]--> (Genre)
                         |
                         +--[:PRODUCED_BY]--> (Studio)


WHY A GRAPH DATABASE?
=====================

The interesting part of a movie catalogue is not only the movie itself;
it is the network around it.

A movie can connect to:

- Actors
- Director
- Genres
- Studio

Actors and other entities can then connect the movie to other movies.

A relational database can represent the same information, but
relationship-heavy questions require multiple joins across junction tables.

In CineGraph, these questions are expressed naturally as graph traversals.

For example:

Movie -> Actor -> Movie

or:

Movie -> Actor -> Movie -> Genre

This makes relationship exploration and graph-based recommendations
a central feature of the application.


GRAPH RELATIONSHIPS
===================

Movie
  |
  +-- DIRECTED BY --> Director
  |
  +-- PRODUCED BY --> Studio
  |
  +-- HAS GENRE --> Genre
  |
  +-- ACTED IN <-- Actor


MAIN GRAPH QUERIES
==================

Find a movie:

MATCH (m:Movie {id: $movieId})
RETURN m


Find actors in a movie:

MATCH (m:Movie {id: $movieId})<-[:ACTED_IN]-(a:Actor)
RETURN a
ORDER BY a.name


Multi-hop recommendations through shared actors:

MATCH (m:Movie {id: $movieId})
      <-[:ACTED_IN]-(a:Actor)
      -[:ACTED_IN]->(related:Movie)

WHERE m <> related

RETURN related,
       COUNT(DISTINCT a) AS sharedActors

ORDER BY sharedActors DESC

LIMIT 10


Multi-hop recommendations through actors and genres:

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


PROJECT STRUCTURE
=================

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
│
├── frontend/
│   ├── app/
│   │   ├── movies/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── MovieCard.tsx
│   │   ├── MoviePoster.tsx
│   │   ├── SearchBar.tsx
│   │   └── LoadingState.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
├── README.md
└── setup.md


1. CREATE COGNODB
=================

Create a CognoDB Cloud instance from the CognoDB console.

Save the following:

- Bolt URI
- Username
- Generated password

The password should be stored securely and must NOT be committed
to GitHub.


2. BACKEND SETUP
================

Open a terminal:

cd backend

Install dependencies:

npm install

Create the environment file:

cp .env.example .env

Configure the environment variables:

COGNODB_URI=bolt+s://your-cognodb-instance
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password_here
PORT=4000
FRONTEND_URL=http://localhost:3000


IMPORTANT:

Do not commit .env to GitHub.

The actual password should only exist in your local .env file
or in the environment-variable settings of the deployment platform.


SEED THE DATABASE
=================

Run:

npm run seed


START THE BACKEND
=================

Run:

npm run start:dev


The backend will run at:

http://localhost:4000


Health check:

http://localhost:4000/health


3. FRONTEND SETUP
=================

Open another terminal:

cd frontend

Install dependencies:

npm install

Create the environment file:

cp .env.example .env.local

Set:

NEXT_PUBLIC_API_URL=http://localhost:4000


Start the frontend:

npm run dev


Open:

http://localhost:3000


4. PRODUCTION BUILD
===================

Frontend:

cd frontend
npm run build


Backend:

cd backend
npm run build


Both projects should complete the production build without
TypeScript or compilation errors.


API ENDPOINTS
=============

GET /health

Checks backend/database availability.


GET /movies?limit=12

Returns movies for the home/listing page.


GET /movies/:id

Returns movie details including:

- Movie information
- Director
- Genres
- Studio
- Poster URL


GET /movies/:id/actors

Returns actors connected to the selected movie.


GET /movies/:id/connections

Returns graph relationship information.


GET /movies/:id/recommendations

Returns graph-based movie recommendations.


GET /search?q=dark&limit=20

Searches the graph for matching movies, actors, directors,
genres or studios.


MOVIE POSTERS
=============

Movie records contain a posterUrl property.

Example:

posterUrl:
https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg

The frontend uses the MoviePoster component to render poster
images safely.

Poster URLs are stored as movie properties in CognoDB rather
than being hard-coded only in the frontend.

This allows movie listings and movie detail pages to use the
same poster information returned by the API.


SEARCH
======

The application provides a search page that can search across
the graph.

Examples:

Christopher

Inception

Batman

Nolan

Marvel


The backend returns the entity type and matching entity.

Example response:

[
  {
    "type": "Movie",
    "item": {
      "id": "inception",
      "title": "Inception",
      "releaseYear": 2010
    }
  }
]


GRAPH-BASED RECOMMENDATIONS
===========================

Recommendations are not based only on movie metadata.

The application traverses graph relationships.

Example:

Selected Movie
      |
      v
    Actor
      |
      v
 Related Movie
      |
      v
   Genre


Movies are ranked using:

- Shared actors
- Shared genres

This demonstrates a multi-hop graph traversal using CognoDB.


ENVIRONMENT VARIABLES
=====================

Backend:

COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD
PORT
FRONTEND_URL


Frontend:

NEXT_PUBLIC_API_URL


SECURITY
========

Never commit:

.env
.env.local

The .gitignore file excludes environment files.

Only .env.example files should be committed.

Example:

COGNODB_URI=bolt+s://your-instance
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your_password_here


IMPORTANT SECURITY NOTE
=======================

Do not put the real CognoDB password in:

- README.md
- README.txt
- seed.ts
- GitHub
- frontend source code
- backend source code
- screenshots
- public configuration files

Use environment variables instead.


GITIGNORE
=========

The repository ignores:

node_modules/
dist/
.next/
.env
.env.*
!.env.example
coverage/
*.log
.DS_Store


ERROR HANDLING
==============

The backend handles database/API errors and returns safe error
responses.

The frontend provides:

- Loading states
- Empty states
- Error states
- Fallback UI for missing poster images


DEMO FLOW
=========

For the assessment screen recording:

1. Open the CineGraph home page.

2. Show the movie listing.

3. Show movie poster images.

4. Search for a movie such as "Inception".

5. Open the Inception movie details page.

6. Show:
   - Rating
   - Release year
   - Duration
   - Director
   - Studio
   - Genres
   - Poster

7. Scroll to the Cast Connections section.

8. Show the connected actors.

9. Scroll to graph-based recommendations.

10. Explain:

    Movie -> Actor -> Movie

11. Explain that recommendations can also use shared genres.

12. Show the search functionality.

13. Show the GitHub repository.

14. Show the seed.ts file.

15. Show the recommendations.cypher file.

16. Show the README and project architecture.


TESTING BEFORE SUBMISSION
=========================

Backend build:

cd backend
npm run build


Frontend build:

cd frontend
npm run build


Backend health:

curl http://localhost:4000/health


Movie API:

curl http://localhost:4000/movies/inception


Search API:

curl "http://localhost:4000/search?q=Inception"


Recommendations:

curl http://localhost:4000/movies/inception/recommendations


GITHUB
======

Repository:

https://github.com/SAMEER-WANKHEDE/cinegraph-cognodb


Before submission, verify that:

- The repository is public if required by the assignment.
- .env is NOT present in GitHub.
- .env.local is NOT present in GitHub.
- No real password appears anywhere in the repository.
- README.md is present.
- Backend source is present.
- Frontend source is present.
- Seed file is present.
- Cypher recommendation queries are present.
- The application builds successfully.
- The application can connect to CognoDB.


DEPLOYMENT
==========

The backend and frontend can be deployed separately.

Backend environment variables:

COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD
FRONTEND_URL


Frontend environment variable:

NEXT_PUBLIC_API_URL


The CognoDB instance must remain available while the deployed
application is being evaluated.


FINAL SUBMISSION CHECKLIST
==========================

[ ] GitHub repository pushed successfully

[ ] README.md updated

[ ] .env excluded from Git

[ ] Real CognoDB password removed from documentation/source

[ ] .env.example contains placeholders only

[ ] Backend builds successfully

[ ] Frontend builds successfully

[ ] CognoDB seed works

[ ] Movie listing works

[ ] Movie posters work

[ ] Search works

[ ] Movie detail page works

[ ] Actor relationships work

[ ] Recommendations work

[ ] Health endpoint works

[ ] No console/build errors

[ ] GitHub repository contains the latest changes


END
===