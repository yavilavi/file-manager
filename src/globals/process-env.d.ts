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
    }
  }
}
export {};
