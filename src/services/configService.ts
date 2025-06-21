
interface ApiConfig {
  stripeKey: string;
  groqKey: string;
}

class ConfigService {
  private static instance: ConfigService;
  private config: ApiConfig;

  private constructor() {
    // Initialize with your provided keys
    this.config = {
      stripeKey: 'sk_8df7fc1dd414ddf60e8f353ea02d7763cf729826f1ef399a',
      groqKey: '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'
    };
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getStripeKey(): string {
    return this.config.stripeKey;
  }

  public getGroqKey(): string {
    return this.config.groqKey;
  }

  public updateKeys(stripeKey?: string, groqKey?: string): void {
    if (stripeKey) this.config.stripeKey = stripeKey;
    if (groqKey) this.config.groqKey = groqKey;
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }
}

export const configService = ConfigService.getInstance();
