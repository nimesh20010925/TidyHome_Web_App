import { useEffect, useState } from 'react';
import axios from 'axios';
import HomeMembersTable from './HomeModals/HomeMembersTable';
import HomeSummary from './HomeModals/HomeSummary';
import './HomeProfile.css'; // You'll need to create this CSS file

const HomeProfile = () => {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState({
    homeName: '',
    number_of_members: '',
    homePhone: '',
    address: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user) {
        setError("No token found, please login.");
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3500/api/home/myhomes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setHome(response.data.homes[0]);
        setEditData({
          homeName: response.data.homes[0].homeName,
          number_of_members: response.data.homes[0].number_of_members,
          homePhone: response.data.homes[0].homePhone,
          address: response.data.homes[0].address
        });
      } else {
        setError('No home found for this user');
      }
    } catch (err) {
      setError('Error fetching home');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateHome = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user || user.role !== 'homeOwner') {
        setError("Unauthorized to update home");
        return;
      }

      const response = await axios.put(
        `http://localhost:3500/api/home/update/${user.homeID}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setHome(response.data.home);
        setIsModalOpen(false);
      }
    } catch (err) {
      setError('Error updating home');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-profile-container">
      <div className="home-profile-header">
        <h1>Home Profile</h1>
        <button className="edit-button" onClick={() => setIsModalOpen(true)}>
          Edit Home Details
        </button>
      </div>

      <div className="home-profile">
        {home ? (
          <div>
            <h2 className="home-profile-home-name">{home.homeName}</h2>
            <p className="home-profile-home-phone">Phone: {home.homePhone}</p>
            <p className="home-profile-home-address">Address: {home.address}</p>
            <p className="home-profile-home-number-of-members">
              Number of Members: {home.number_of_members}
            </p>
          </div>
        ) : (
          <p>No home data available</p>
        )}
      </div>

      <HomeSummary />
      <HomeMembersTable />

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="home-profile-modal-content">
            <div className="modal-header">
              <h2>Edit Home Details</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Home Name</label>
                <input
                  type="text"
                  name="homeName"
                  value={editData.homeName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Number of Members</label>
                <input
                  type="number"
                  name="number_of_members"
                  value={editData.number_of_members}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Home Phone</label>
                <input
                  type="text"
                  name="homePhone"
                  value={editData.homePhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={handleUpdateHome}>
                Save
              </button>
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeProfile;