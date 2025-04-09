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
      CORS_ORIGIN_REGEX: string;
      JWT_SECRET: string;
      JWT_AUD: string;
      JWT_ISS: string;
      BASE_URL: string;
      PROTOCOL?: string;
    }
  }
}
export {};
