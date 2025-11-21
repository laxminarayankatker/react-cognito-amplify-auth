export async function exchangeCodeWithBackend(code, verifier, tokens = null, challenge = null) {
  const body = { 
    code, 
    codeVerifier: verifier 
  };
  
  // Add challenge if provided (for PKCE verification on backend)
  if (challenge) {
    body.codeChallenge = challenge;
  }
  
  // Add tokens if provided (for direct sign-in flow)
  if (tokens) {
    body.id_token = tokens.id_token;
    body.access_token = tokens.access_token;
    body.refresh_token = tokens.refresh_token;
  }
  
  console.log(`body.....................: ${JSON.stringify(body)}`);

  const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_1}/auth/exchange-token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" ,
      "x-forwarded-host": window.location.host
    },
    body: JSON.stringify(body)
  });
  return response;
}
