/**
 * Example demonstrating when Auth.currentAuthenticatedUser() works
 * This file is for reference only - not meant to be imported
 */

import { Auth } from "aws-amplify";

// ============================================
// SCENARIO 1: Successful Sign-In Flow
// ============================================

async function exampleSignInFlow() {
  try {
    // Step 1: Sign in
    // This automatically stores the user in sessionStorage
    const signInResult = await Auth.signIn("user@example.com", "password");
    
    // ✅ At this point, the user is stored in sessionStorage
    // Amplify stores:
    // - User object
    // - ID token
    // - Access token  
    // - Refresh token
    // - LastAuthUser (username)
    
    // Step 2: Immediately retrieve the user
    // This works because user was stored in Step 1
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log("Current user:", currentUser);
    // ✅ SUCCESS - Returns the user object
    
    // Step 3: Get session (also works)
    const session = await Auth.currentSession();
    console.log("Session:", session);
    // ✅ SUCCESS - Returns session with tokens
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// SCENARIO 2: Using currentAuthenticatedUser in Different Component
// ============================================

async function exampleInDifferentComponent() {
  try {
    // This works if user was previously signed in (in same tab)
    // Even if called from a different component/page
    const user = await Auth.currentAuthenticatedUser();
    console.log("User from different component:", user);
    // ✅ SUCCESS - Works because user is in sessionStorage
    
    // You can use this user for operations like:
    await Auth.changePassword(user, "oldPassword", "newPassword");
    await Auth.updateUserAttributes(user, { email: "new@example.com" });
    
  } catch (error) {
    if (error === "not authenticated" || error.code === "NotAuthorizedException") {
      console.log("No user is currently signed in");
      // Redirect to login page
    } else {
      console.error("Error:", error);
    }
  }
}

// ============================================
// SCENARIO 3: What Happens After Sign Out
// ============================================

async function exampleAfterSignOut() {
  try {
    // User is signed in
    const user = await Auth.currentAuthenticatedUser();
    console.log("User before sign out:", user);
    // ✅ SUCCESS
    
    // Sign out - this clears sessionStorage
    await Auth.signOut();
    
    // Try to get user after sign out
    const userAfterSignOut = await Auth.currentAuthenticatedUser();
    // ❌ ERROR - Throws "not authenticated" because storage was cleared
    
  } catch (error) {
    console.log("Expected error after sign out:", error.message);
    // Error: "not authenticated"
  }
}

// ============================================
// SCENARIO 4: Checking User on App Load
// ============================================

async function checkUserOnAppLoad() {
  try {
    // Check if user is already authenticated (e.g., on page refresh)
    const user = await Auth.currentAuthenticatedUser();
    
    // User is authenticated
    console.log("User is authenticated:", user.username);
    // ✅ User exists in sessionStorage from previous sign-in
    
    // Get user attributes
    const attributes = await Auth.userAttributes(user);
    console.log("User attributes:", attributes);
    
    return { authenticated: true, user };
    
  } catch (error) {
    // No user is authenticated
    console.log("No authenticated user");
    // ❌ User not found in sessionStorage (never signed in, signed out, or tab was closed)
    
    return { authenticated: false, user: null };
  }
}

// ============================================
// SCENARIO 5: Your Current Code Flow
// ============================================

async function yourCurrentSignInFlow() {
  try {
    // From SignIn.js - Line 23
    const res = await Auth.signIn(email, password);
    
    // ✅ User is NOW stored in sessionStorage
    // You can immediately call currentAuthenticatedUser()
    
    // From SignIn.js - Line 36 (optional)
    const session = await Auth.currentSession();
    // ✅ Works because user was stored above
    
    // Later, in ChangePassword.js - Line 24
    const user = await Auth.currentAuthenticatedUser();
    // ✅ Works because user is still in sessionStorage
    // (as long as tab hasn't been closed)
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// KEY POINTS:
// ============================================
// 
// 1. User is stored AUTOMATICALLY when Auth.signIn() succeeds
// 2. No manual storage needed - Amplify handles it
// 3. Storage location: sessionStorage (in your config)
// 4. Persistence: Only within the same browser tab
// 5. currentAuthenticatedUser() reads from storage
// 6. Works across components/pages in the same tab
// 7. Cleared when: signOut(), tab closes, or session expires
//

