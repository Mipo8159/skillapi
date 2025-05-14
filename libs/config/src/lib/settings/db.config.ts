export abstract class DBConfig {
  abstract getDatabaseUrl(): string;
  abstract getEnvironment(): string;
}
