import { useState, useEffect } from 'react';
import axios from 'axios';

function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    axios.get('http://localhost:5000/api/test')
      .then(response => {
        setStatus(response.data.message);
      })
      .catch(error => {
        setStatus('Error connecting to backend');
        console.error('Error:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Backend Connection Status:</h2>
      <p>{status}</p>
    </div>
  );
}

export default TestConnection;
