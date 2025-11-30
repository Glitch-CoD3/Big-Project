import React from 'react';

function ApiError({ message }) {
  return (
    <div style={{ color: 'red', margin: '1rem 0', fontWeight: 'bold' }}>
      {message || 'Something went wrong. Please try again later.'}
    </div>
  );
}

export default ApiError;
