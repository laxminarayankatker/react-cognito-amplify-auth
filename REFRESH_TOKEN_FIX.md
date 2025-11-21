# Refresh Token Issue Fix

## Problem

The refresh token was not being retrieved when using `Auth.signIn()` with AWS Amplify v5.2.0.

## Root Cause

The issue was using the **wrong method name** to extract the refresh token:

### ❌ Incorrect Code:
```javascript
const refreshToken = session?.getRefreshToken()?.getJwtToken() || 
                     (res?.signInUserSession?.refreshToken?.jwtToken);
```

### ✅ Correct Code:
```javascript
const refreshToken = session?.getRefreshToken()?.getToken() || 
                     (res?.signInUserSession?.refreshToken?.token);
```

## Why This Happens

In AWS Amplify / Amazon Cognito Identity JS, different token types have different methods:

| Token Type | Class | Method to Get Token String |
|------------|-------|---------------------------|
| ID Token | `CognitoIdToken` | `getJwtToken()` |
| Access Token | `CognitoAccessToken` | `getJwtToken()` |
| **Refresh Token** | `CognitoRefreshToken` | **`getToken()`** ⚠️ |

### Type Definitions

From `amazon-cognito-identity-js/index.d.ts`:

```typescript
// ID Token and Access Token use getJwtToken()
export class CognitoIdToken {
  public getJwtToken(): string;
}

export class CognitoAccessToken {
  public getJwtToken(): string;
}

// Refresh Token uses getToken() - DIFFERENT!
export class CognitoRefreshToken {
  public getToken(): string;  // ← Note: getToken(), not getJwtToken()
}
```

## The Fix

### Updated Code in SignIn.js:

```javascript
// ID Token - uses getJwtToken()
const idToken = session?.getIdToken()?.getJwtToken() || 
                (res?.signInUserSession?.idToken?.jwtToken);

// Access Token - uses getJwtToken()
const accessToken = session?.getAccessToken()?.getJwtToken() || 
                    (res?.signInUserSession?.accessToken?.jwtToken);

// Refresh Token - uses getToken() (NOT getJwtToken())
const refreshToken = session?.getRefreshToken()?.getToken() || 
                     (res?.signInUserSession?.refreshToken?.token);
```

## Why Refresh Token Uses Different Method

The refresh token is **not a JWT** (JSON Web Token). It's a simple opaque token string that Cognito uses to issue new access/ID tokens. Therefore, it doesn't have JWT-specific methods like `getJwtToken()`, `getExpiration()`, or `decodePayload()`.

## Additional Notes

### When Refresh Token is Available

The refresh token is available:
- ✅ After successful `Auth.signIn()`
- ✅ In `Auth.currentSession()` after sign-in
- ✅ Stored in sessionStorage (in your config)

### When Refresh Token Might Not Be Available

- ❌ If the user pool is configured to not issue refresh tokens
- ❌ If the session hasn't been established yet
- ❌ If tokens haven't been stored in sessionStorage yet

### Debugging

The code now includes debug logging to help verify:
```javascript
console.log("Session object:", session);
console.log("SignIn result:", res);
console.log("Refresh token:", refreshToken);
console.log("Has session refresh token:", !!session?.getRefreshToken?.());
console.log("Has res refresh token:", !!res?.signInUserSession?.refreshToken);
```

## Testing

After the fix, you should see:
1. The refresh token is successfully retrieved
2. It's included in the backend API call
3. Console logs show the refresh token value

## Summary

**The fix:** Change `getJwtToken()` to `getToken()` when accessing the refresh token from `CognitoRefreshToken` object.

This is a common mistake because ID and Access tokens use `getJwtToken()`, but the Refresh token uses `getToken()`.

