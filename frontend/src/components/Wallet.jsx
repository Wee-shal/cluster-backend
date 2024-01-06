import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/helpers';
import { userContext } from '../state/userState';

const Wallet = () => {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const id = window.localStorage.getItem('id');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser(id);
        setUser(fetchedUser);

        // Store user data in local storage
        window.localStorage.setItem('userData', JSON.stringify(fetchedUser));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check local storage for existing user data
    const storedUserData = JSON.parse(window.localStorage.getItem('userData'));
    if (storedUserData) {
      setUser(storedUserData);
    } else {
      // Fetch user data if not available in local storage
      fetchUser();
    }
  }, [id, setUser]);

  if (!user) {
    // If user data is not available, you can return null or some default content
    return null;
  }

  const walletContainerStyle = {
    position: 'absolute',
    top: '1.5rem',
    right: '7rem',
    color: 'black',
    backgroundColor: 'white',
    padding: '0.5rem 0.5rem',
    borderRadius: '4%',
    cursor: 'pointer',
    border: user.balance === 0 ? '2px solid red' : user.balance < 20 ? '2px solid yellow' : '2px solid green',
    '@media (max-width: 768px)': {
      right: '4.5rem',
    },
  };

  const balanceTextStyle = {
    fontSize: '1rem',
    /* Additional styles for balance text */
  };

  return (
    <div style={walletContainerStyle} onClick={() => navigate('/payment')}>
      <div style={balanceTextStyle}>
        Balance: {user.currency}
        {user.balance !== null && user.balance !== undefined ? user.balance.toFixed(2).toLocaleString() : 'N/A'}
      </div>
    </div>
  );
};

export default Wallet;
