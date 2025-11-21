# How `Auth.currentAuthenticatedUser()` Works

## Overview

`Auth.currentAuthenticatedUser()` retrieves the currently authenticated user from storage. The user is automatically stored by AWS Amplify when authentication succeeds.

## When is the Current User Set?

The current user is set **automatically** by AWS Amplify in the following scenarios:

### 1. **During `Auth.signIn()`** ✅
When `Auth.signIn(email, password)` completes successfully:
- Amplify stores the user object and session tokens in the configured storage (sessionStorage in your case)
- The user is immediately available via `currentAuthenticatedUser()`

```javascript
// Step 1: Sign in - this automatically stores the user
const user = await Auth.signIn(email, password);

// Step 2: Immediately after, you can retrieve it
const currentUser = await Auth.currentAuthenticatedUser(); // ✅ Works!
```

### 2. **During `Auth.confirmSignIn()`** ✅
After completing MFA or other challenges:
- The user session is established and stored

### 3. **During `Auth.completeNewPassword()`** ✅
After completing the new password requirement:
- The user session is established and stored

### 4. **During OAuth/Hosted UI Flow** ✅
After successful OAuth callback:
- The user is stored automatically

## Storage Mechanism

Based on your configuration in `amplifyConfig.js`:

```javascript
storage: sessionStorage,  // User data is stored here
```

Amplify stores the following in `sessionStorage`:
- **User object**: Contains user attributes, username, etc.
- **Session tokens**: ID token, Access token, Refresh token
- **Session metadata**: Expiration times, token types

### Storage Keys Used by Amplify:
- `CognitoIdentityServiceProvider.{clientId}.{username}.idToken`
- `CognitoIdentityServiceProvider.{clientId}.{username}.accessToken`
- `CognitoIdentityServiceProvider.{clientId}.{username}.refreshToken`
- `CognitoIdentityServiceProvider.{clientId}.LastAuthUser`

## How `currentAuthenticatedUser()` Works

```javascript
const user = await Auth.currentAuthenticatedUser();
```

**Internal Process:**
1. Reads `LastAuthUser` from storage to get the username
2. Retrieves the user object and session data from storage
3. Validates that the session is still valid (not expired)
4. Returns the `CognitoUser` object if valid
5. Throws an error if no user is found or session is invalid

## Important Points

### ✅ User is Set Automatically
You **don't need to manually set** the current user. Amplify handles this automatically when:
- Sign-in succeeds
- Session is refreshed
- OAuth flow completes

### ⚠️ Session Storage vs Local Storage
Your config uses `sessionStorage`, which means:
- User data is **cleared when the browser tab closes**
- User data persists during page refreshes within the same tab
- User data is **NOT shared** across browser tabs

If you want persistence across browser sessions, use `localStorage`:
```javascript
storage: localStorage,  // Persists across browser sessions
```

### 🔄 Session Refresh
Amplify automatically refreshes tokens when they expire (using the refresh token). The user remains "current" as long as:
- The refresh token is valid
- The user hasn't signed out
- The storage hasn't been cleared

## Example Flow in Your Code

```javascript
// In SignIn.js - Line 23
const res = await Auth.signIn(email, password);
// ✅ At this point, user is stored in sessionStorage

// In SignIn.js - Line 36 (optional check)
const session = await Auth.currentSession();
// ✅ This works because user was stored above

// In ChangePassword.js - Line 24
const user = await Auth.currentAuthenticatedUser();
// ✅ This retrieves the user stored during sign-in
```

## When `currentAuthenticatedUser()` Fails

It throws an error in these cases:
1. **No user signed in**: `Auth.signIn()` was never called or failed
2. **User signed out**: `Auth.signOut()` was called
3. **Session expired**: Refresh token expired and couldn't be renewed
4. **Storage cleared**: sessionStorage was cleared manually
5. **Tab closed**: sessionStorage is cleared when tab closes (in your config)

## Best Practices

### 1. Check for User on App Load
```javascript
useEffect(() => {
  Auth.currentAuthenticatedUser()
    .then(user => {
      // User is authenticated
      setUser(user);
    })
    .catch(err => {
      // No user or session expired
      setUser(null);
    });
}, []);
```

### 2. Handle Errors Gracefully
```javascript
try {
  const user = await Auth.currentAuthenticatedUser();
  // Use user
} catch (err) {
  if (err === 'not authenticated') {
    // Redirect to login
  } else {
    // Handle other errors
  }
}
```

### 3. Use `currentSession()` for Token Access
```javascript
// Get tokens directly
const session = await Auth.currentSession();
const idToken = session.getIdToken().getJwtToken();
const accessToken = session.getAccessToken().getJwtToken();
```

## Summary

| Event | User Stored? | `currentAuthenticatedUser()` Works? |
|-------|--------------|-------------------------------------|
| `Auth.signIn()` succeeds | ✅ Yes | ✅ Yes |
| `Auth.confirmSignIn()` succeeds | ✅ Yes | ✅ Yes |
| `Auth.completeNewPassword()` succeeds | ✅ Yes | ✅ Yes |
| OAuth callback succeeds | ✅ Yes | ✅ Yes |
| `Auth.signOut()` | ❌ No (cleared) | ❌ No |
| Session expired | ❌ No (cleared) | ❌ No |
| Tab closed (sessionStorage) | ❌ No (cleared) | ❌ No |

**Key Takeaway**: The user is automatically stored when authentication succeeds. You don't need to manually manage this - just call `currentAuthenticatedUser()` when you need the user object.

