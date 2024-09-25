import dotenv from 'dotenv';

dotenv.config({ path: "../.env" });

const config = {
    port: process.env.PORT,
    corsOrigin: process.env.CORS_ORIGIN,
    mongoDbUrl: process.env.MONGODB_URL,
    mongoDbUserId: process.env.MONGODB_USERID,
    mongoDbPass: process.env.MONGODB_PASSWORD,
    mongoDbLocalHost: process.env.MONGODB_LCALHOST_URL,
    mongoDbName: process.env.MONGODB_DATABASE,

    pgUser: process.env.POSTGRES_USER,
    pgHost: process.env.POSTGRES_HOST,
    pgDbName: process.env.POSTGRES_DATABASE,
    pgPassword: process.env.POSTGRES_PASSWORD,
    pgPort: process.env.POSTGRES_PORT,

    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,

    cloudName: process.env.CLOUD_NAME,
    cloudKey: process.env.CLOUD_API_KEY,
    cloudSecret: process.env.CLOUD_API_SECRET,

    gmail: process.env.GMAIL,
    gmailPassword: process.env.GMAIL_PASSWORD,
    googleMapsAPIKey: process.env.GOOGLE_MAPS_API_KEY,
    googleOAuth2Ref: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectURI: process.env.GOOGLE_REDIRECT_URI,

    outlookMail: process.env.OUTLOOK_MAIL,
    outlookMailPassword: process.env.OUTLOOK_PASSWORD,

    azureClientId: process.env.AZURE_CLIENT_ID,
    azureTenantId: process.env.AZURE_TENANT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,
    azureClientSecretId: process.env.AZURE_CLIENT_SECRET_ID,
    
    azureCurrentAuthCode: process.env.AZURE_CURRENT_AUTH_CODE,
    azureAccessToken: process.env.AZURE_ACCESS_TOKEN,
    azureRefreshToken: process.env.AZURE_REFRESH_TOKEN,
    azureAccessTokenExpiry: process.env.AZURE_ACCESS_TOKEN_EXPIRY,

    currentCity: process.env.CURRENT_CITY
};


export { config }

