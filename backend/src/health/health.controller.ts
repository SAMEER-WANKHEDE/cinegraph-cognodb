import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j.service';

@Controller('health')
export class HealthController {
  constructor(private readonly neo4j: Neo4jService) {}

  @Get()
  async health() {
    try {
      const session = this.neo4j.getSession();
      try {
        await session.run('RETURN 1 AS ok');
      } finally {
        await session.close();
      }

      return {
        status: 'ok',
        database: 'connected',
        service: 'cinegraph-api',
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'unreachable',
      });
    }
  }
}
