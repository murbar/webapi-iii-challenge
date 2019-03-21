import { useState, useEffect } from 'react';
import axios from 'axios';

const useResource = (endpoint = null) => {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestWrapper = cb => async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      await cb(...args);
      setIsLoading(false);
    } catch (error) {
      console.dir(error);
      setError(error);
      setIsLoading(false);
    }
  };

  const getAll = requestWrapper(async () => {
    const { data } = await axios.get(endpoint);
    setState(data);
  });

  useEffect(() => {
    if (endpoint) {
      getAll();
    } else {
      setState([]);
    }
  }, [endpoint]);

  return {
    state,
    isLoading,
    error,
    getAll
  };
};

export default useResource;
