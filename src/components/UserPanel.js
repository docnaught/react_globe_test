import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import './UserPanel.css';

const UserPanel = () => {
  const { connected, users, username, updateUsername } = useSocket();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      updateUsername(newName.trim());
      setEditingName(false);
      setNewName('');
    }
  };
  
  return (
    <div className="user-panel">
      <div className="connection-status">
        Status: {connected ? (
          <span className="connected">Connected</span>
        ) : (
          <span className="disconnected">Disconnected</span>
        )}
      </div>
      
      <div className="user-info">
        {editingName ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new username"
              autoFocus
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingName(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <span>Your name: <strong>{username}</strong></span>
            <button onClick={() => {
              setNewName(username);
              setEditingName(true);
            }}>Change</button>
          </>
        )}
      </div>
      
      <div className="users-list">
        <h3>Online Users ({Object.keys(users).length})</h3>
        <ul>
          {Object.values(users).map(user => (
            <li key={user.id}>
              {user.name} {user.id === username && "(You)"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPanel;
