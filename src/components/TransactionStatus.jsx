
// src/components/TransactionStatus.jsx
import React from 'react';
import { Alert } from 'flowbite-react';

export const TransactionStatus = ({ status, message, onClose }) => {
  if (!status) return null;

  const alertTypes = {
    success: { color: "success", icon: "✓" },
    error: { color: "failure", icon: "✕" },
    loading: { color: "warning", icon: "⧗" }
  };

  return (
    <Alert
      color={alertTypes[status].color}
      onDismiss={onClose}
      className="fixed top-4 right-4 z-50 max-w-md"
    >
      <div className="flex items-center gap-2">
        <span>{alertTypes[status].icon}</span>
        <span>{message}</span>
      </div>
    </Alert>
  );
};

