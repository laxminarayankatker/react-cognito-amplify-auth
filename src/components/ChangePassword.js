import React, { useState } from "react";
import { Auth } from "aws-amplify";

export default function ChangePassword({ onSuccess, onCancel }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Get the current authenticated user
      const user = await Auth.currentAuthenticatedUser();
      
      // Change the password
      await Auth.changePassword(user, oldPassword, newPassword);
      
      onSuccess && onSuccess("Password changed successfully!");
      
      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src="/creative-capsule-logo.png" alt="Creative Capsule" style={{width:120, marginBottom:12}}/>
        <h2>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <label>Current Password</label>
          <input 
            type="password" 
            value={oldPassword} 
            onChange={e => setOldPassword(e.target.value)} 
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
            {loading ? "Changing..." : "Change Password"}
          </button>
          {onCancel && (
            <div style={{marginTop:10}}>
              <button type="button" onClick={onCancel} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

