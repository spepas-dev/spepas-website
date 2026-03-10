// src/lib/advertApis.ts
import apiClient from './axios';

// GET: Get list of active advert sliders
export const getActiveSliders = async () => {
  const { data } = await apiClient.get('/advert/slider-active');
  return data;
};
