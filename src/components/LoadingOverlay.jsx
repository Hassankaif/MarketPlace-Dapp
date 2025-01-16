// src/components/LoadingOverlay.jsx
import React from 'react';

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
<img
  className="rounded-lg shadow-lg"
  src="/load-animation-unscreen.gif"
  alt="Loading Animation"
  width="300"
/>
    <p className="text-white text-lg mt-4 animate-pulse">Processing Transaction...</p>
  </div>
);

export default LoadingOverlay;
