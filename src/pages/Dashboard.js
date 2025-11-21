// create a dashboard page that displays the user's information
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const handleLogout = () => {
    // Clear any local state if needed
    navigate('/');
  };
export default function Dashboard(){
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_GATEWAY_2}/dashboard`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Important: This sends cookies (id_token, access_token, refresh_token)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDashboardData(data);
                setLoading(false);
            }   
            catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);


//   return (
//     <div>
//       <h1>Dashboard</h1>
//     </div>
//   );
return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-data">
          <h2>Dashboard Data</h2>
          <pre className="dashboard-json">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}   
