import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { formatRate } from '../utils/formatRate';

const API_URL = 'https://open.er-api.com/v6/latest';

export const useCurrencyRate = () => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const fetchRate = async (base, target) => {
    if (!base || !target) return;

    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${API_URL}/${base.toUpperCase()}`);
      const foundRate = data.rates[target.toUpperCase()];
      
      if (foundRate === undefined) {
        throw new Error('Неверная базовая или целевая валюта');
      }
      
      const formattedRate = formatRate(foundRate, target);
      setRate(formattedRate);
      
      loadingTimerRef.current = setTimeout(() => {
        setLoading(false);
        loadingTimerRef.current = null;
      }, 300);
    } catch (e) {
      setError(e.message || 'Произошла ошибка');
      setLoading(false);
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }
  };

  return { rate, loading, error, fetchRate };
};

