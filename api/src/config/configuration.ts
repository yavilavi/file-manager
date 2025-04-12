import { registerAs } from '@nestjs/config';

const configuration = registerAs('', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseAppUrl: process.env.BASE_APP_URL,
  baseApiDomain: process.env.BASE_API_DOMAIN,
  protocol: process.env.PROTOCOL,
  allowedWildcardDomains: process.env.ALLOWED_WILDCARD_DOMAINS.split(','),
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(','),
  onlyoffice: {
    url: process.env.ONLYOFFICE_URL,
    secret: process.env.JWT_SECRET,
    internalBeUrl: process.env.ONLYOFFICE_INTERNAL_BE_URL,
  },
  email: {
    provider: process.env.EMAIL_PROVIDER,
    from: process.env.EMAIL_FROM,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
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
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
    bucket: process.env.MINIO_BUCKET,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    port: parseInt(process.env.MINIO_PORT) || 9000,
  },
}));

export default configuration;
