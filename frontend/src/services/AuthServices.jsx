import axios from 'axios';

const API_URL = 'http://localhost:3500/api/auth'; // Define base URL

// Login Function
export const loginUser = async (email, password, navigate) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password }, {
      headers: {
        'Content-Type': 'application/json', // Ensure the correct Content-Type is sent
      }
    });

    // Save token and user to localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Navigate to the home page or the protected route
    navigate('/home');
  } catch (error) {
    console.error("Login failed", error);
    
    // Check if there's a response error
    if (error.response) {
      // Handle the error message from the backend
      alert(error.response.data.message || "Invalid email or password.");
    } else {
      alert("An error occurred. Please try again later.");
    }
  }
};

// Signup Function
export const signUpUser = async (username, email, password, phone, address, navigate) => {
    try {
      if (!username || !email || !password || !phone || !address) {
        throw new Error("All fields are required.");
      }
  
      const response = await axios.post('http://localhost:3500/api/auth/register', { username, email, password, phone, address });
  
      // Redirect user to login page after successful signup
      navigate('/login');
    } catch (error) {
      console.error("Signup failed", error.response || error);
      alert(error.response?.data?.message || "Error during signup. Please try again.");
    }
  };