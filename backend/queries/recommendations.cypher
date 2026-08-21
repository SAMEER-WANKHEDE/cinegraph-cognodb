// 1. Movie details
MATCH (m:Movie {id: $movieId})
RETURN m;

// 2. Actors in a movie
MATCH (m:Movie {id: $movieId})<-[:ACTED_IN]-(a:Actor)
RETURN a
ORDER BY a.name;

// 3. Multi-hop: Movie -> Actor -> Movie
MATCH (m:Movie {id: $movieId})
      <-[:ACTED_IN]-(a:Actor)
      -[:ACTED_IN]->(related:Movie)
WHERE m <> related
RETURN related,
       COUNT(DISTINCT a) AS sharedActors
ORDER BY sharedActors DESC
LIMIT 10;

// 4. Multi-hop: Movie -> Actor -> Movie -> Genre -> Movie
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
LIMIT 10;

// 5. Director connection
MATCH (m:Movie {id: $movieId})<-[:DIRECTED]-(d:Director)-[:DIRECTED]->(related:Movie)
WHERE m <> related
RETURN related, d
ORDER BY related.title;
