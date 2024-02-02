import React, { useState } from 'react';

const FakeAuthComponent = ({ authProvider }) => {
  const [username, setUsername] = useState<string>(''); // Local state to store the username

  const handleSignin = async () => {
    try {
      await authProvider.signin(username);
    } catch (error) {
      console.error('Signin failed:', error);
    }
  };

  const handleSignout = async () => {
    try {
      await authProvider.signout();
    } catch (error) {
      console.error('Signout failed:', error);
    }
  };

  return (
    <div>
      <p>Authenticated: {authProvider.isAuthenticated.toString()}</p>
      <p>Username: {authProvider.username}</p>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSignin}>Sign In</button>
      <button onClick={handleSignout}>Sign Out</button>
    </div>
  );
};

export default FakeAuthComponent;
