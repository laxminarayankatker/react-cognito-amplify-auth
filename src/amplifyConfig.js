import { Amplify } from "aws-amplify";

// Environment variables are accessible at build time and runtime
// They must be defined in a .env file at the project root
// Create a .env file with REACT_APP_ prefixed variables

const config = {
  Auth: {
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN || "http://localhost:3000/auth/callback",
      redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT || "http://localhost:3000/logout",
      responseType: "code"
    },
    storage: sessionStorage,
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_COGNITO_REGION',
  'REACT_APP_USER_POOL_ID',
  'REACT_APP_COGNITO_CLIENT_ID',
  'REACT_APP_COGNITO_DOMAIN'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please create a .env file in the project root with these variables.');
  console.error('Example .env file:');
  console.error('REACT_APP_COGNITO_REGION=us-east-1');
  console.error('REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX');
  console.error('REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx');
  console.error('REACT_APP_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com');
}

Amplify.configure(config);
export default config;
