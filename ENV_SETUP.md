# Environment Variables Setup

## Issue

`process.env.REACT_APP_USER_POOL_ID` and other environment variables are not accessible because the `.env` file doesn't exist.

## Solution

Create a `.env` file in the project root with your environment variables.

## Steps

1. **Create a `.env` file** in the root directory (same level as `package.json`)

2. **Add your environment variables** with the `REACT_APP_` prefix:

```env
# AWS Cognito Configuration
REACT_APP_COGNITO_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_3SVGUW8gw
REACT_APP_COGNITO_CLIENT_ID=3c7cql7cl5a4dqbocqu8vnpf5r
REACT_APP_COGNITO_DOMAIN=us-east-13svguw8gw.auth.us-east-1.amazoncognito.com

# API Gateway URLs
REACT_APP_API_GATEWAY_1=https://2052tlcei8.execute-api.us-east-1.amazonaws.com
REACT_APP_API_GATEWAY_2=https://your-api-gateway-2-url.execute-api.us-east-1.amazonaws.com

# Optional: Redirect URLs (defaults provided in code)
REACT_APP_REDIRECT_SIGN_IN=http://localhost:3000/auth/callback
REACT_APP_REDIRECT_SIGN_OUT=http://localhost:3000/logout
```

3. **Restart the development server** after creating/modifying the `.env` file:
   ```bash
   npm start
   ```

## Important Notes

### Create React App Environment Variables

- ✅ **Must be prefixed with `REACT_APP_`** to be accessible in the browser
- ✅ **Defined in `.env` file** at the project root
- ✅ **Accessible via `process.env.REACT_APP_*`** in your code
- ✅ **Available at build time and runtime**
- ❌ **NOT accessible** without the `REACT_APP_` prefix
- ❌ **NOT accessible** if not in `.env` file
- ❌ **Requires server restart** after changes

### Security

- ⚠️ **Never commit `.env` to git** - it should be in `.gitignore`
- ⚠️ **Create `.env.example`** with placeholder values for documentation
- ⚠️ **Use different `.env` files** for different environments (`.env.development`, `.env.production`)

### File Structure

```
project-root/
├── .env                    ← Create this file
├── .env.example            ← Optional: Template file
├── .gitignore              ← Should include .env
├── package.json
├── src/
│   └── amplifyConfig.js    ← Uses process.env.REACT_APP_*
└── ...
```

## Verification

After creating the `.env` file and restarting the server, you can verify the variables are accessible:

```javascript
// In amplifyConfig.js or any component
console.log('User Pool ID:', process.env.REACT_APP_USER_POOL_ID);
console.log('Region:', process.env.REACT_APP_COGNITO_REGION);
```

If the values are `undefined`, check:
1. ✅ File is named exactly `.env` (not `.env.txt` or `.env.local`)
2. ✅ File is in the project root (same level as `package.json`)
3. ✅ Variables are prefixed with `REACT_APP_`
4. ✅ Development server was restarted after creating the file
5. ✅ No typos in variable names

## Troubleshooting

### Variables are undefined

1. **Check file location**: `.env` must be in the project root
2. **Check prefix**: Must start with `REACT_APP_`
3. **Restart server**: Stop and restart `npm start`
4. **Check syntax**: No spaces around `=` sign
5. **Check quotes**: Values don't need quotes unless they contain spaces

### Variables work in development but not production

- Environment variables are embedded at **build time**
- Run `npm run build` after setting environment variables
- For production, set environment variables in your hosting platform (Vercel, Netlify, AWS, etc.)

## Example .env File

```env
# AWS Cognito
REACT_APP_COGNITO_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_3SVGUW8gw
REACT_APP_COGNITO_CLIENT_ID=3c7cql7cl5a4dqbocqu8vnpf5r
REACT_APP_COGNITO_DOMAIN=us-east-13svguw8gw.auth.us-east-1.amazoncognito.com

# API Gateway
REACT_APP_API_GATEWAY_1=https://2052tlcei8.execute-api.us-east-1.amazonaws.com
REACT_APP_API_GATEWAY_2=https://your-api-gateway-2-url.execute-api.us-east-1.amazonaws.com
```

