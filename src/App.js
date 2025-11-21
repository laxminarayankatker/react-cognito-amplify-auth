import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// simialr to tenantmismatch page but for dashboard
import Dashboard from "./pages/Dashboard";
import TenantMismatch from "./pages/TenantMismatch";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/tenant-mismatch" element={<TenantMismatch/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}
