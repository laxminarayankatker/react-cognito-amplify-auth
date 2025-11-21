import React from "react";
import SignIn from "../components/SignIn";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
  const nav = useNavigate();

  return (
    <SignIn
      onSuccess={() => nav('/dashboard')}
      onTenantMismatch={(msg) => nav('/tenant-mismatch', { state: { msg } })}
    />
  );
}
