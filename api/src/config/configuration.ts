import { registerAs } from '@nestjs/config';

const configuration = registerAs('', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: process.env.BASE_URL,
  protocol: process.env.PROTOCOL,
  allowedWildcardDomains: process.env.ALLOWED_WILDCARD_DOMAINS.split(','),
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(','),
  jwt: {
    secret: process.env.JWT_SECRET,
    aud: process.env.JWT_AUD,
    iss: process.env.JWT_ISS,
  },
  database: {
    url: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    schema: process.env.DB_SCHEMA,
  },
  minio: {
    endpoint: process.env.MINIO_ENDPOINT,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucket: process.env.MINIO_BUCKET,
  },
}));

export default configuration;
