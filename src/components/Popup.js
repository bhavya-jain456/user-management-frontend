import React, { useEffect, useState } from 'react';
import './Popup.css'; // Add styles for the popup

const Popup = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [isError, setIsError] = useState(false); // To track error or success

  useEffect(() => {
    const handlePopup = (event) => {
      const message = event.detail.message;
      setMessage(message);

      // Check if the message is an error and update state
      setIsError(event.detail.isError || false);
      setVisible(true);

      // Hide the popup after 3 seconds
      setTimeout(() => setVisible(false), 3000);
    };

    // Listen for the custom 'showPopup' event
    window.addEventListener('showPopup', handlePopup);

    return () => {
      window.removeEventListener('showPopup', handlePopup);
    };
  }, []);

  return (
    visible && (
      <div className={`popup ${isError ? 'error' : ''}`}>
        <p>{message}</p>
      </div>
    )
  );
};

export default Popup;
