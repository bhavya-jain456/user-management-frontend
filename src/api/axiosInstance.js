import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://test-task-lt6f.onrender.com', // Replace with your backend base URL
  timeout: 20000,
});

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is within the allowed range, return it
    return response;
  },
  (error) => {
    // const status = error.response?.status;
    const data = error.response?.data;
    
    // Check if the response contains status: false
    if (data?.status === false) {
      const errorMessage = data?.msg || 'Something went wrong!';
      // Dispatch a custom event to show the error popup with the 'msg' key
      const event = new CustomEvent('showPopup', { detail: { message: errorMessage } });
      window.dispatchEvent(event);
    } else {
      const errorMessage = data?.message || 'Something went wrong!';
      // Dispatch a custom event to show the error popup
      const event = new CustomEvent('showPopup', { detail: { message: errorMessage } });
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
