import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import './ActivityLog.css';

const ActivityLog = () => {
  const { socket, users } = useSocket();
  const [activities, setActivities] = useState([]);
  const logRef = useRef(null);
  
  useEffect(() => {
    if (!socket) return;
    
    // Add event listeners for activities
    socket.on('userJoined', (user) => {
      addActivity(`${user.name} joined`);
    });
    
    socket.on('userLeft', (userId) => {
      const userName = users[userId]?.name || 'Unknown user';
      addActivity(`${userName} left`);
    });
    
    socket.on('userUpdated', (user) => {
      addActivity(`User changed name to ${user.name}`);
    });
    
    socket.on('countrySelected', ({ userId, country, userName }) => {
      addActivity(`${userName || 'Someone'} selected ${country.properties.NAME}`);
    });
    
    socket.on('cameraUpdated', ({ userName }) => {
      addActivity(`${userName || 'Someone'} moved the camera`);
    });
    
    // Cleanup
    return () => {
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userUpdated');
      socket.off('countrySelected');
      socket.off('cameraUpdated');
    };
  }, [socket, users]);
  
  useEffect(() => {
    // Auto-scroll to the bottom when new activities are added
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [activities]);
  
  const addActivity = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setActivities(prev => [
      ...prev, 
      { id: Date.now(), message, timestamp }
    ].slice(-50)); // Keep only the latest 50 activities
  };
  
  return (
    <div className="activity-log">
      <h3>Activity Log</h3>
      <div className="log-container" ref={logRef}>
        {activities.length === 0 ? (
          <p className="no-activity">No activity yet</p>
        ) : (
          <ul>
            {activities.map(activity => (
              <li key={activity.id}>
                <span className="timestamp">{activity.timestamp}</span>
                <span className="message">{activity.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
