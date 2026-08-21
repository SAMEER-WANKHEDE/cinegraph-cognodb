import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Neo4jService } from '../database/neo4j.service';

@Injectable()
export class MoviesService {
  constructor(private readonly neo4j: Neo4jService) {}

  private async run<T>(
    query: string,
    params: Record<string, unknown> = {},
  ): Promise<T[]> {
    const session = this.neo4j.getSession();
    try {
      const result = await session.run(query, params);
      return result.records.map((record) => record.toObject() as T);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Unable to query the graph database.',
        detail: error instanceof Error ? error.message : String(error),
      });
    } finally {
      await session.close();
    }
  }

  async findAll(limit = 12) {
    const rows = await this.run<{ movie: Record<string, unknown> }>(
      `
      MATCH (m:Movie)
      RETURN m AS movie
      ORDER BY m.title
      LIMIT $limit
      `,
      { limit },
    );

    return rows.map((row) => row.movie?.properties ?? row.movie);
  }

  async findOne(id: string) {
    const rows = await this.run<{
      movie: Record<string, unknown>;
      director: Record<string, unknown> | null;
      genres: Record<string, unknown>[];
      studio: Record<string, unknown> | null;
    }>(
      `
      MATCH (m:Movie {id: $movieId})
      OPTIONAL MATCH (m)<-[:DIRECTED]-(d:Director)
      OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
      OPTIONAL MATCH (m)-[:PRODUCED_BY]->(s:Studio)
      RETURN m AS movie,
             head(collect(DISTINCT d)) AS director,
             collect(DISTINCT g) AS genres,
             head(collect(DISTINCT s)) AS studio
      `,
      { movieId: id },
    );

   if (!rows.length) {
      throw new NotFoundException('Movie not found.');
    }

    const row = rows[0];

    return {
      movie: row.movie?.properties ?? row.movie,
      director: row.director?.properties ?? null,
      genres: row.genres.map((genre) => genre?.properties ?? genre),
      studio: row.studio?.properties ?? null,
    };
  }

  async getActors(id: string) {
    const rows = await this.run<{ actor: Record<string, unknown> }>(
      `
      MATCH (m:Movie {id: $movieId})<-[:ACTED_IN]-(a:Actor)
      RETURN DISTINCT a AS actor
      ORDER BY a.name
      `,
      { movieId: id },
    );

    return rows.map((row) => row.actor?.properties ?? row.actor);
  }

  async getConnections(id: string) {
    const rows = await this.run<{
      actor: Record<string, unknown>;
      relatedMovie: Record<string, unknown>;
    }>(
      `
      MATCH (m:Movie {id: $movieId})
            <-[:ACTED_IN]-(a:Actor)
            -[:ACTED_IN]->(related:Movie)
      WHERE m <> related
      RETURN DISTINCT a AS actor, related AS relatedMovie
      ORDER BY related.title
      LIMIT 30
      `,
      { movieId: id },
    );

    return rows.map((row) => ({
      actor: row.actor?.properties ?? row.actor,
      relatedMovie: row.relatedMovie?.properties ?? row.relatedMovie,
    }));
  }

  async getRecommendations(id: string) {
    const rows = await this.run<{
      movie: Record<string, unknown>;
      sharedActors: number;
      sharedGenres: number;
    }>(
      `
      MATCH (m:Movie {id: $movieId})
            <-[:ACTED_IN]-(a:Actor)
            -[:ACTED_IN]->(related:Movie)
            -[:HAS_GENRE]->(g:Genre)
            <-[:HAS_GENRE]-(m)
      WHERE m <> related
      RETURN related AS movie,
             COUNT(DISTINCT a) AS sharedActors,
             COUNT(DISTINCT g) AS sharedGenres
      ORDER BY sharedActors DESC, sharedGenres DESC, related.rating DESC
      LIMIT 10
      `,
      { movieId: id },
    );

    return rows.map((row) => ({
      ...row,
      movie: row.movie?.properties ?? row.movie,
    }));
  }

  async search(query: string, limit = 20) {
    const q = query.trim();

    if (!q) {
      return this.findAll(Math.min(limit, 12));
    }

    const rows = await this.run<{
      type: string;
      item: Record<string, unknown>;
    }>(
      `
      MATCH (n)
      WHERE
        (n:Movie AND toLower(n.title) CONTAINS toLower($q))
        OR (n:Actor AND toLower(n.name) CONTAINS toLower($q))
        OR (n:Director AND toLower(n.name) CONTAINS toLower($q))
        OR (n:Genre AND toLower(n.name) CONTAINS toLower($q))
      RETURN
        CASE
          WHEN n:Movie THEN 'Movie'
          WHEN n:Actor THEN 'Actor'
          WHEN n:Director THEN 'Director'
          ELSE 'Genre'
        END AS type,
        n AS item
      ORDER BY item.name, item.title
      LIMIT $limit
      `,
      { q, limit },
    );

    return rows.map((row) => ({
      type: row.type,
      item: row.item?.properties ?? row.item,
    }));
  }
}
