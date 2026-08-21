import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(Neo4jService.name);
  private driver!: Driver;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const uri = this.config.get<string>('COGNODB_URI');
    const username = this.config.get<string>('COGNODB_USERNAME', 'cognodb');
    const password = this.config.get<string>('COGNODB_PASSWORD');

    if (!uri || !password) {
      this.logger.warn(
        'CognoDB environment variables are missing. Set COGNODB_URI and COGNODB_PASSWORD.',
      );
      return;
    }

    this.driver = neo4j.driver(
      uri,
      neo4j.auth.basic(username, password),
      {
        disableLosslessIntegers: true,
      },
    );

    try {
      await this.driver.verifyConnectivity();
      this.logger.log('Connected to CognoDB successfully.');
    } catch (error) {
      this.logger.error(
        `CognoDB connectivity check failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  getDriver(): Driver {
    if (!this.driver) {
      throw new Error('Neo4j/CognoDB driver is not configured.');
    }
    return this.driver;
  }

  getSession(): Session {
    return this.getDriver().session();
  }

  async onModuleDestroy() {
    if (this.driver) {
      await this.driver.close();
    }
  }
}
