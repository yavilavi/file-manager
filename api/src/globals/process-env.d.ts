declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DB_URL: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;
      DB_PORT: string;
      PORT: string;
      DB_SCHEMA: string;
      MINIO_ENDPOINT: string;
      MINIO_ACCESS_KEY: string;
      MINIO_SECRET_KEY: string;
      MINIO_BUCKET: string;
      ALLOWED_ORIGINS: string;
      ALLOWED_WILDCARD_DOMAINS: string;
      JWT_SECRET: string;
      JWT_AUD: string;
      JWT_ISS: string;
      BASE_APP_URL: string;
      PROTOCOL?: string;
      EMAIL_PROVIDER: string;
      EMAIL_FROM: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      MINIO_USE_SSL: string;
      MINIO_PORT: string;
    }
  }
}
export {};
