export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  resources: {
     website: process.env.APP_WEBSITE,
    appname: process.env.APP_NAME,
    description: process.env.DESCRIPTION,
    version: process.env.VERSION,
    logo: process.env.LOGO,
    primaryColor: process.env.PRIMARY_COLOR,
    secondaryColor: process.env.SECONDARY_COLOR,
  },
  mongoDb: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10) || 5432,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    dbname: process.env.MONGO_DBNAME,
  },
  redisDb: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    user: process.env.REDIS_USER,
    db: parseInt(process.env.REDIS_DB, 10),
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    // Collection names
    driverCollection: process.env.FIREBASE_DRIVER_COLLECTION || 'Drivers',
    trackingCollection: process.env.FIREBASE_TRACKING_COLLECTION || 'DriversPositions',
  },
 mail: {
    enabled: !!parseInt(process.env.MAIL_ENABLED),
    sender: process.env.MAIL_SENDER,
    transport: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10) || 587,
      secure: !!parseInt(process.env.MAIL_SECURE),
    },
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    mailgen: {
      theme: process.env.MAILGEN_THEME,
      logoHeight: process.env.MAILGEN_LOGO_HEIGHT,
      logoWidth: process.env.MAILGEN_LOGO_WIDTH,
    },
  },
  googleMap: {
    key: process.env.GOOGLE_MAP_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
