import React, { useState, useEffect } from 'react';
import './LoadingSpinner.css';
import { useLoading } from './LoadingContext';

const LoadingSpinner = () => {
  const { loading } = useLoading();
  const [showSpinner, setShowSpinner] = useState(true); // Alapértelmezés: true, hogy azonnal látható legyen

  useEffect(() => {
    console.log('loading:', loading);
    if (!loading) {
      const timer = setTimeout(() => setShowSpinner(false), 1000); // Minimum 1000ms láthatóság
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!showSpinner) return null;

  return (
    <div className="loading-spinner">
      <div className="spinner-circle"></div>
      <div className="text-circle">
        <span className="text-char shop">Shop</span>
        <span className="text-char zone">Zone</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;