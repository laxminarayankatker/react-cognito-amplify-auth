// import React from "react";
// import { useLocation } from "react-router-dom";

// export default function TenantMismatch(){
//   const { state } = useLocation();
//   return (
//     <div style={{padding:40}}>
//       <h2>Tenant Validation Failed</h2>
//       <p>{state?.msg || 'Unauthorized tenant.'}</p>
//     </div>
//   );
// }
import React from 'react';
import { useLocation } from "react-router-dom";



function TenantMismatchPage() {
  //const searchParams = new URLSearchParams(window.location.search);
  //const logoutUrl = searchParams.get('logoutUrl');
  //const freshLoginUrl = searchParams.get('freshLoginUrl');
  const { state } = useLocation();
  const logoutUrl = state?.logoutUrl;


  const handleLogoutAndLogin = async () => {
    if (logoutUrl) {
      // Option 1: Use logout URL (recommended - clears session properly)
      // Cognito will automatically redirect to freshLoginUrl after logout
      window.location.href = logoutUrl;
    } 
  };

  return (
    <div>
      <h1>Tenant Access Denied</h1>
      <p>You are not authorized to access this tenant. Please log in with the correct tenant account.</p>
      <button onClick={handleLogoutAndLogin} disabled={!logoutUrl}>
        {logoutUrl ? 'Logout and Login Again' : 'Go to Home'}
      </button>
    </div>
  );
}

export default TenantMismatchPage;

