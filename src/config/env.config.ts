export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.BD_HOST,
  dbPort: process.env.DB_PORT,
  dbUsername: process.env.DB_USERNAME,
  port: process.env.PORT || 3000,
  //defaultLimit: +process.env.DEFAULT_LIMIT || 5,
});
