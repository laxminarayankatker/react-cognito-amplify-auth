import React, { useState } from "react";
import { Auth } from "aws-amplify";

export default function ForgotPassword({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("request"); // 'request' or 'confirm'
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request password reset code
  async function handleForgotPassword(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await Auth.forgotPassword(email);
      setStep("confirm");
      setErrorMsg(""); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Submit new password with code
  async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      onSuccess && onSuccess("Password reset successful! Please login with your new password.");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  if (step === "confirm") {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <img src="/creative-capsule-logo.png" alt="Creative Capsule" style={{width:120, marginBottom:12}}/>
          <h2>Reset Password</h2>
          <p>Enter the code sent to your email and your new password.</p>
          <form onSubmit={handleForgotPasswordSubmit}>
            <label>Verification Code</label>
            <input 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              placeholder="Enter code from email" 
              required 
            />
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
            />
            <label>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
            {errorMsg && <div className="error">{errorMsg}</div>}
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <div style={{marginTop:10}}>
              <button type="button" onClick={() => setStep("request")} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/creative-capsule-logo.png" alt="Creative Capsule" style={{width:120, marginBottom:12}}/>
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you a verification code.</p>
        <form onSubmit={handleForgotPassword}>
          <label>Email</label>
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@company.com" 
            type="email"
            required 
          />
          {errorMsg && <div className="error">{errorMsg}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <div style={{marginTop:10}}>
            {onBack && (
              <button type="button" onClick={onBack} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>
                Back to Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

