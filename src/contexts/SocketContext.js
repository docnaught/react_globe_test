import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create the context
const SocketContext = createContext();

// Get the server URL - change this when deploying
const SERVER_URL = process.env.REACT_APP_SOCKET_SERVER || 'http://localhost:3001';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState({});
  const [selectedCountries, setSelectedCountries] = useState({});
  const [username, setUsername] = useState('');

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const newSocket = io(SERVER_URL);
    
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setConnected(true);
      
      // Generate a default username
      const defaultUsername = `User-${Math.floor(Math.random() * 1000)}`;
      setUsername(defaultUsername);
      newSocket.emit('updateUsername', defaultUsername);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setConnected(false);
    });
    
    // Handle initialization data
    newSocket.on('init', (data) => {
      setUsers(data.users || {});
      setSelectedCountries(data.selectedCountries || {});
    });
    
    // Handle user updates
    newSocket.on('userJoined', (user) => {
      setUsers(prevUsers => ({ ...prevUsers, [user.id]: user }));
    });
    
    newSocket.on('userUpdated', (user) => {
      setUsers(prevUsers => ({ ...prevUsers, [user.id]: user }));
    });
    
    newSocket.on('userLeft', (userId) => {
      setUsers(prevUsers => {
        const newUsers = { ...prevUsers };
        delete newUsers[userId];
        return newUsers;
      });
      
      setSelectedCountries(prevSelected => {
        const newSelected = { ...prevSelected };
        delete newSelected[userId];
        return newSelected;
      });
    });
    
    // Handle country selections
    newSocket.on('countrySelected', ({ userId, country }) => {
      setSelectedCountries(prev => ({ ...prev, [userId]: country }));
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Update username
  const updateUsername = (newName) => {
    if (socket && newName) {
      setUsername(newName);
      socket.emit('updateUsername', newName);
    }
  };
  
  // Select country
  const selectCountry = (country) => {
    if (socket && country) {
      socket.emit('selectCountry', country);
    }
  };
  
  // Update camera position
  const updateCamera = (position) => {
    if (socket && position) {
      socket.emit('updateCamera', position);
    }
  };
  
  // Value to provide through the context
  const value = {
    socket,
    connected,
    users,
    username,
    updateUsername,
    selectedCountries,
    selectCountry,
    updateCamera
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
