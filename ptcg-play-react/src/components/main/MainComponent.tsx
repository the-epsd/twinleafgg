import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/games');
  }, [navigate]);

  return null;
};

export default MainComponent; 