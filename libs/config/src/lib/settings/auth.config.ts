export abstract class AuthConfig {
  abstract getAccessSecret(): string;
  abstract getRefreshSecret(): string;
  abstract getAccessExpiration(): string;
  abstract getRefreshExpiration(): string;
}
