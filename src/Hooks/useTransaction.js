// src/hooks/useTransaction.js
import { useState } from 'react';

export const useTransaction = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [txMessage, setTxMessage] = useState('');

  const handleTransaction = async (transactionFn, successMessage) => {
    setIsProcessing(true);
    setTxStatus('loading');
    setTxMessage('Processing transaction...');

    try {
      const tx = await transactionFn();
      setTxStatus('loading');
      setTxMessage('Waiting for confirmation...');
      
      await tx.wait();
      
      setTxStatus('success');
      setTxMessage(successMessage);
      return true;
    } catch (error) {
      console.error('Transaction error:', error);
      setTxStatus('error');
      setTxMessage(error.message || 'Transaction failed');
      return false;
    } finally {
      setIsProcessing(false);
      // Auto-hide success/error message after 5 seconds
      setTimeout(() => {
        setTxStatus(null);
        setTxMessage('');
      }, 5000);
    }
  };

  return {
    isProcessing,
    txStatus,
    txMessage,
    handleTransaction,
    clearTxStatus: () => {
      setTxStatus(null);
      setTxMessage('');
    }
  };
};