import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { generatePKCE } from "../utils/pkce";
import { exchangeCodeWithBackend } from "../utils/api";

export default function SignIn({ onSuccess, onTenantMismatch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { verifier, challenge } = await generatePKCE();
      sessionStorage.setItem("pkce_verifier", verifier);

      // Build authorize URL to call hosted UI in the background using a fetch to /oauth2/authorize is not supported.
      // Instead use Auth.signIn which will perform SRP and return a user object.
      const res = await Auth.signIn(email, password);

      // If amplify returns challenge or does not provide a code, we handle failure
      if (res.challengeName) {
        setErrorMsg("Unsupported Cognito challenge encountered.");
        setLoading(false);
        return;
      }

      // Many Cognito setups with Amplify will return tokens; in this pattern we expect the backend to perform validation.
      // For compatibility, attempt to get session and extract tokens if present
      let session = null;
      try {
        session = await Auth.currentSession();
      } catch (e){
        // ignore
      }

      const idToken = session?.getIdToken()?.getJwtToken?.() || (res?.signInUserSession?.idToken?.jwtToken);
      const accessToken = session?.getAccessToken?.()?.getJwtToken?.() || (res?.signInUserSession?.accessToken?.jwtToken);
      // RefreshToken uses getToken() method, not getJwtToken()
      const refreshToken = session?.getRefreshToken?.()?.getToken?.() || (res?.signInUserSession?.refreshToken?.token);

      // Debug logging
      console.log("Session object:", session);
      console.log("SignIn result:", res);
      console.log("Refresh token:", refreshToken);
      console.log("Has session refresh token:", !!session?.getRefreshToken?.());
      console.log("Has res refresh token:", !!res?.signInUserSession?.refreshToken);

      if (!idToken) {
        setErrorMsg("No id_token returned by Cognito/Amplify");
        setLoading(false);
        return;
      }

      // Send tokens to backend for tenant validation and cookie creation
      const backendResponse = await exchangeCodeWithBackend(null, null, { id_token: idToken, access_token: accessToken, refresh_token: refreshToken }, challenge);

      if(backendResponse.status === 401) {
        const responsedata = await backendResponse.json();
        const logouturl = responsedata.logouturl;
        if(logouturl) {
          onTenantMismatch && onTenantMismatch(logouturl);
          return;
        }
      }
      if (!backendResponse.ok) {
        // throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
        setErrorMsg(`Token exchange failed: ${backendResponse.status} ${backendResponse.statusText}`);
        setLoading(false);
        return;
      }
      // if (backendRes.tenantMismatch) {
      //   onTenantMismatch && onTenantMismatch(backendRes.message || "Tenant mismatch");
      //   return;
      // }

      // if (backendRes.error) {
      //   setErrorMsg(backendRes.error);
      //   setLoading(false);
      //   return;
      // }

      onSuccess && onSuccess(backendResponse);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/creative-capsule-logo.png" alt="Creative Capsule" style={{width:120, marginBottom:12}}/>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required />
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {errorMsg && <div className="error">{errorMsg}</div>}
          <button type="submit">Login</button>
          <div style={{marginTop:10}}>
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
