import React from 'react';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;