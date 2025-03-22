import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeMembersTable from './HomeModals/HomeMembersTable';
import HomeSummary from './HomeModals/HomeSummary';

const HomeProfile = () => {
  const [home, setHome] = useState(null); // To store the home data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    fetchHome();
  }, []);

  // Fetch home owned by the relevant owner (authenticated user)
  const fetchHome = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) {
        setError("No token found, please login.");
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3500/api/home/myhomes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setHome(response.data.homes[0]); // Assuming the user has only one home
      } else {
        setError('No home found for this user');
      }
    } catch (err) {
      setError('Error fetching home');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
        <HomeSummary/>
    <div className="home-profile">
      {home ? (
        <div>
          <h2>{home.homeName}</h2>
          <p>Phone: {home.homePhone}</p>
          <p>Address: {home.address}</p>
          <p>Number of Members: {home.number_of_members}</p>
        </div>
      ) : (
        <p>No home data available</p>
      )}
      <HomeMembersTable/>
    </div>
    </div>
  );
};

export default HomeProfile;
