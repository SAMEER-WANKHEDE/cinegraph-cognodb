import 'dotenv/config';
import neo4j from 'neo4j-driver';

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME || 'cognodb';
const password = process.env.COGNODB_PASSWORD;

if (!uri || !password) {
  throw new Error(
    'Set COGNODB_URI and COGNODB_PASSWORD before running the seed.',
  );
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password),
  { disableLosslessIntegers: true },
);

// -----------------------------------------------------
// GENRES
// -----------------------------------------------------

const genres = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'animation', name: 'Animation' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'crime', name: 'Crime' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'thriller', name: 'Thriller' },
];

// -----------------------------------------------------
// STUDIOS
// -----------------------------------------------------

const studios = [
  { id: 'warner', name: 'Warner Bros.' },
  { id: 'pixar', name: 'Pixar' },
  { id: 'marvel', name: 'Marvel Studios' },
  { id: 'universal', name: 'Universal Pictures' },
  { id: 'paramount', name: 'Paramount Pictures' },
  { id: 'dreamworks', name: 'DreamWorks' },
];

// -----------------------------------------------------
// DIRECTORS
// -----------------------------------------------------

const directors = [
  { id: 'nolan', name: 'Christopher Nolan' },
  { id: 'spielberg', name: 'Steven Spielberg' },
  { id: 'villeneuve', name: 'Denis Villeneuve' },
  { id: 'gerwig', name: 'Greta Gerwig' },
  { id: 'coogler', name: 'Ryan Coogler' },
  { id: 'bird', name: 'Brad Bird' },
  { id: 'whedon', name: 'Joss Whedon' },
  { id: 'russo', name: 'Anthony Russo' },
  { id: 'russo2', name: 'Joe Russo' },
  { id: 'johnson', name: 'Rian Johnson' },
];

// -----------------------------------------------------
// ACTORS
// -----------------------------------------------------

const actors = [
  { id: 'bale', name: 'Christian Bale' },
  { id: 'ledger', name: 'Heath Ledger' },
  { id: 'oldman', name: 'Gary Oldman' },
  { id: 'cillian', name: 'Cillian Murphy' },
  { id: 'hardy', name: 'Tom Hardy' },
  { id: 'diCaprio', name: 'Leonardo DiCaprio' },
  { id: 'jgl', name: 'Joseph Gordon-Levitt' },
  { id: 'pattinson', name: 'Robert Pattinson' },
  { id: 'dicaprio2', name: 'Leonardo DiCaprio' },
  { id: 'mcconaughey', name: 'Matthew McConaughey' },
  { id: 'chalamet', name: 'Timothée Chalamet' },
  { id: 'rebecca', name: 'Rebecca Ferguson' },
  { id: 'gosling', name: 'Ryan Gosling' },
  { id: 'margot', name: 'Margot Robbie' },
  { id: 'emma', name: 'Emma Stone' },
  { id: 'ryan', name: 'Ryan Reynolds' },
  { id: 'rdj', name: 'Robert Downey Jr.' },
  { id: 'evans', name: 'Chris Evans' },
  { id: 'hemworth', name: 'Chris Hemsworth' },
  { id: 'scarlett', name: 'Scarlett Johansson' },
  { id: 'holland', name: 'Tom Holland' },
  { id: 'zendaya', name: 'Zendaya' },
  { id: 'keaton', name: 'Michael Keaton' },
  { id: 'hanks', name: 'Tom Hanks' },
  { id: 'cruise', name: 'Tom Cruise' },
  { id: 'ford', name: 'Harrison Ford' },
  { id: 'johansson', name: 'Scarlett Johansson' },
  { id: 'portman', name: 'Natalie Portman' },
  { id: 'daniel', name: 'Daniel Craig' },
  { id: 'adele', name: 'Ana de Armas' },
];

// -----------------------------------------------------
// MOVIES
// -----------------------------------------------------

const movies = [
  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    releaseYear: 2008,
    rating: 9.0,
    duration: 152,
    description:
      'Batman faces a criminal mastermind who pushes Gotham into chaos.',
    director: 'nolan',
    studio: 'warner',
    genres: ['action', 'crime', 'drama'],
    actors: ['bale', 'ledger', 'oldman', 'cillian'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },

  {
    id: 'inception',
    title: 'Inception',
    releaseYear: 2010,
    rating: 8.8,
    duration: 148,
    description:
      'A specialist who steals secrets through dreams is offered a chance to erase his past.',
    director: 'nolan',
    studio: 'warner',
    genres: ['action', 'sci-fi', 'thriller'],
    actors: ['diCaprio', 'hardy', 'jgl', 'cillian'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  },

  {
    id: 'interstellar',
    title: 'Interstellar',
    releaseYear: 2014,
    rating: 8.7,
    duration: 169,
    description:
      'Explorers travel through a wormhole in search of a future for humanity.',
    director: 'nolan',
    studio: 'warner',
    genres: ['adventure', 'drama', 'sci-fi'],
    actors: ['mcconaughey', 'cillian', 'hardy'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },

  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    releaseYear: 2023,
    rating: 8.6,
    duration: 180,
    description:
      'A scientist leads the effort to develop the first atomic bomb.',
    director: 'nolan',
    studio: 'universal',
    genres: ['drama', 'thriller'],
    actors: ['cillian', 'hardy'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  },

  {
    id: 'tenet',
    title: 'Tenet',
    releaseYear: 2020,
    rating: 7.3,
    duration: 150,
    description:
      'An agent manipulates the flow of time to prevent a global catastrophe.',
    director: 'nolan',
    studio: 'warner',
    genres: ['action', 'sci-fi', 'thriller'],
    actors: ['pattinson', 'hardy'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/oh8X788M1N2mU5g5B9z8Jr1Q7JH.jpg',
  },

  {
    id: 'dune',
    title: 'Dune',
    releaseYear: 2021,
    rating: 8.0,
    duration: 155,
    description:
      'A young heir travels to a dangerous desert world central to an interstellar conflict.',
    director: 'villeneuve',
    studio: 'warner',
    genres: ['adventure', 'drama', 'sci-fi'],
    actors: ['chalamet', 'rebecca', 'zendaya'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },

  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    releaseYear: 2024,
    rating: 8.6,
    duration: 166,
    description:
      'Paul joins the Fremen while seeking revenge and confronting his destiny.',
    director: 'villeneuve',
    studio: 'warner',
    genres: ['action', 'adventure', 'sci-fi'],
    actors: ['chalamet', 'rebecca', 'zendaya'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg',
  },

  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    releaseYear: 2017,
    rating: 8.0,
    duration: 164,
    description:
      'A new blade runner uncovers a secret that leads him to a former officer.',
    director: 'villeneuve',
    studio: 'warner',
    genres: ['drama', 'sci-fi', 'thriller'],
    actors: ['gosling', 'ford'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
  },

  {
    id: 'barbie',
    title: 'Barbie',
    releaseYear: 2023,
    rating: 6.8,
    duration: 114,
    description:
      'A perfect doll begins questioning her world and discovers the real world.',
    director: 'gerwig',
    studio: 'warner',
    genres: ['comedy', 'drama', 'fantasy'],
    actors: ['margot', 'gosling'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Bb9LqCXaL.jpg',
  },

  {
    id: 'little-women',
    title: 'Little Women',
    releaseYear: 2019,
    rating: 7.8,
    duration: 135,
    description:
      'Four sisters navigate love, ambition and family during the Civil War era.',
    director: 'gerwig',
    studio: 'universal',
    genres: ['drama'],
    actors: ['emma', 'chalamet'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/yn5ihODtZ7ofn8F7dG1kQz3l8yT.jpg',
  },

  {
    id: 'black-panther',
    title: 'Black Panther',
    releaseYear: 2018,
    rating: 7.3,
    duration: 134,
    description:
      'The new king of Wakanda must protect his nation from an old rival.',
    director: 'coogler',
    studio: 'marvel',
    genres: ['action', 'adventure', 'drama'],
    actors: ['keaton', 'rdj'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
  },

  {
    id: 'iron-man',
    title: 'Iron Man',
    releaseYear: 2008,
    rating: 7.9,
    duration: 126,
    description:
      'A billionaire engineer builds a powered suit after a life-changing experience.',
    director: 'whedon',
    studio: 'marvel',
    genres: ['action', 'sci-fi'],
    actors: ['rdj', 'scarlett'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
  },

  {
    id: 'avengers-endgame',
    title: 'Avengers: Endgame',
    releaseYear: 2019,
    rating: 8.4,
    duration: 181,
    description:
      'The Avengers attempt to reverse a devastating loss and restore the universe.',
    director: 'russo',
    studio: 'marvel',
    genres: ['action', 'adventure', 'sci-fi'],
    actors: ['rdj', 'evans', 'hemworth', 'scarlett', 'holland'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  },

  {
    id: 'captain-america',
    title: 'Captain America: The Winter Soldier',
    releaseYear: 2014,
    rating: 7.7,
    duration: 136,
    description:
      'Captain America discovers a conspiracy inside the organization he serves.',
    director: 'russo',
    studio: 'marvel',
    genres: ['action', 'thriller'],
    actors: ['evans', 'scarlett', 'rdj'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg',
  },

  {
    id: 'spider-man-homecoming',
    title: 'Spider-Man: Homecoming',
    releaseYear: 2017,
    rating: 7.4,
    duration: 133,
    description:
      'Peter Parker balances high school with his life as a young superhero.',
    director: 'johnson',
    studio: 'marvel',
    genres: ['action', 'adventure', 'comedy'],
    actors: ['holland', 'zendaya', 'rdj'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0hJbG1U.jpg',
  },

  {
    id: 'jurassic-park',
    title: 'Jurassic Park',
    releaseYear: 1993,
    rating: 8.2,
    duration: 127,
    description:
      'A theme park with cloned dinosaurs becomes a fight for survival.',
    director: 'spielberg',
    studio: 'universal',
    genres: ['adventure', 'sci-fi', 'thriller'],
    actors: ['hanks', 'ford'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/fjTU1.jpg',
  },

  {
    id: 'ready-player-one',
    title: 'Ready Player One',
    releaseYear: 2018,
    rating: 7.4,
    duration: 140,
    description:
      'A teenager competes in a virtual treasure hunt with the future of the world at stake.',
    director: 'spielberg',
    studio: 'warner',
    genres: ['action', 'adventure', 'sci-fi'],
    actors: ['holland'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/pU1ULUq8D3iRxl1fdX2lVq3sV8.jpg',
  },

  {
    id: 'mission-impossible',
    title: 'Mission: Impossible – Fallout',
    releaseYear: 2018,
    rating: 7.7,
    duration: 147,
    description:
      'An IMF agent races against time after a mission goes wrong.',
    director: 'russo2',
    studio: 'paramount',
    genres: ['action', 'adventure', 'thriller'],
    actors: ['cruise', 'rebecca'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcL1n.jpg',
  },

  {
    id: 'top-gun',
    title: 'Top Gun: Maverick',
    releaseYear: 2022,
    rating: 8.2,
    duration: 131,
    description:
      'A veteran pilot trains a new generation for a dangerous mission.',
    director: 'johnson',
    studio: 'paramount',
    genres: ['action', 'drama'],
    actors: ['cruise', 'holland'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
  },

  {
    id: 'ford-v-ferrari',
    title: 'Ford v Ferrari',
    releaseYear: 2019,
    rating: 8.1,
    duration: 152,
    description:
      'A racing team attempts to build a car capable of defeating Ferrari at Le Mans.',
    director: 'coogler',
    studio: 'universal',
    genres: ['action', 'drama'],
    actors: ['bale', 'holland'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/6ApDtO7xaWAf5rXpxbCAQYgDr1P.jpg',
  },

  {
    id: 'incredibles',
    title: 'The Incredibles',
    releaseYear: 2004,
    rating: 8.0,
    duration: 115,
    description:
      'A family of superheroes is forced back into action.',
    director: 'bird',
    studio: 'pixar',
    genres: ['action', 'animation', 'comedy'],
    actors: ['hanks'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58u1k.jpg',
  },

  {
    id: 'ratatouille',
    title: 'Ratatouille',
    releaseYear: 2007,
    rating: 8.1,
    duration: 111,
    description:
      'A rat with a passion for cooking forms an unusual partnership with a young chef.',
    director: 'bird',
    studio: 'pixar',
    genres: ['animation', 'comedy', 'drama'],
    actors: ['hanks'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg',
  },

  {
    id: 'knives-out',
    title: 'Knives Out',
    releaseYear: 2019,
    rating: 7.9,
    duration: 130,
    description:
      'A detective investigates a wealthy family after the death of its patriarch.',
    director: 'johnson',
    studio: 'universal',
    genres: ['comedy', 'crime', 'drama'],
    actors: ['daniel', 'adele'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg',
  },

  {
    id: 'no-time-to-die',
    title: 'No Time to Die',
    releaseYear: 2021,
    rating: 7.3,
    duration: 163,
    description:
      'James Bond leaves retirement for a mission involving an old ally.',
    director: 'johnson',
    studio: 'universal',
    genres: ['action', 'adventure', 'thriller'],
    actors: ['daniel', 'adele'],
    posterUrl:
      'https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg',
  },
];

// -----------------------------------------------------
// SEED DATABASE
// -----------------------------------------------------

async function seed() {
  const session = driver.session();

  try {
    console.log('Clearing existing database...');

    await session.run('MATCH (n) DETACH DELETE n');

    // -------------------------------------------------
    // CONSTRAINTS
    // -------------------------------------------------

    await session.run(`
      CREATE CONSTRAINT movie_id IF NOT EXISTS
      FOR (m:Movie) REQUIRE m.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT actor_id IF NOT EXISTS
      FOR (a:Actor) REQUIRE a.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT director_id IF NOT EXISTS
      FOR (d:Director) REQUIRE d.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT genre_id IF NOT EXISTS
      FOR (g:Genre) REQUIRE g.id IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT studio_id IF NOT EXISTS
      FOR (s:Studio) REQUIRE s.id IS UNIQUE
    `);

    // -------------------------------------------------
    // GENRES
    // -------------------------------------------------

    await session.run(
      `
      UNWIND $genres AS item

      MERGE (g:Genre {id: item.id})

      SET g.name = item.name
      `,
      { genres },
    );

    // -------------------------------------------------
    // STUDIOS
    // -------------------------------------------------

    await session.run(
      `
      UNWIND $studios AS item

      MERGE (s:Studio {id: item.id})

      SET s.name = item.name
      `,
      { studios },
    );

    // -------------------------------------------------
    // DIRECTORS
    // -------------------------------------------------

    await session.run(
      `
      UNWIND $directors AS item

      MERGE (d:Director {id: item.id})

      SET d.name = item.name
      `,
      { directors },
    );

    // -------------------------------------------------
    // ACTORS
    // -------------------------------------------------

    await session.run(
      `
      UNWIND $actors AS item

      MERGE (a:Actor {id: item.id})

      SET a.name = item.name
      `,
      { actors },
    );

    // -------------------------------------------------
    // MOVIES
    // -------------------------------------------------

    for (const movie of movies) {
      await session.run(
        `
        MATCH (d:Director {id: $director})
        MATCH (s:Studio {id: $studio})

        CREATE (m:Movie {
          id: $id,
          title: $title,
          releaseYear: $releaseYear,
          rating: $rating,
          duration: $duration,
          description: $description,
          posterUrl: $posterUrl
        })

        CREATE (d)-[:DIRECTED]->(m)

        CREATE (m)-[:PRODUCED_BY]->(s)

        WITH m

        UNWIND $genres AS genreId

        MATCH (g:Genre {id: genreId})

        CREATE (m)-[:HAS_GENRE]->(g)

        WITH m

        UNWIND $actors AS actorId

        MATCH (a:Actor {id: actorId})

        CREATE (a)-[:ACTED_IN]->(m)
        `,
        movie,
      );
    }

    // -------------------------------------------------
    // VERIFY INCEPTION
    // -------------------------------------------------

    const verification = await session.run(`
      MATCH (m:Movie {id: 'inception'})
      RETURN
        m.id AS id,
        m.title AS title,
        m.posterUrl AS posterUrl
    `);

    console.log(
      'Inception verification:',
      verification.records.map((record) => record.toObject()),
    );

    console.log('');
    console.log('==========================================');
    console.log('DATABASE SEEDED SUCCESSFULLY');
    console.log('==========================================');
    console.log(`Movies:    ${movies.length}`);
    console.log(`Actors:    ${actors.length}`);
    console.log(`Directors: ${directors.length}`);
    console.log(`Genres:    ${genres.length}`);
    console.log(`Studios:   ${studios.length}`);
    console.log('==========================================');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});