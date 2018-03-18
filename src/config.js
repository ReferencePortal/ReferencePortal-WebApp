export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://5by75p4gn3.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_owioEgj7S",
    APP_CLIENT_ID: "7cfgcgiojnjocg3p8qpp5aths6",
    IDENTITY_POOL_ID: "us-east-1:f48656f2-7a2d-4d5a-a30d-436624c5900c"
  }
};
