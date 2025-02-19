import axios, { AxiosResponse } from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

interface WeatherData {
  cod: string;
  message?: string;
  name?: string;
  main?: {
    temp: number;
    humidity: number;
  };
  weather?: {
    description: string;
  }[];
}

interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  message?: string;
}

export const fetchWeather = async (city: string): Promise<WeatherResponse> => {
  if (!city) throw new Error('You must enter a city.');
  if (!API_KEY || !BASE_URL) {
    throw new Error('API configuration missing. Check environment variables.');
  }

  const formattedCity = city.trim();

  try {
    const response: AxiosResponse<WeatherData> = await axios.get(BASE_URL, {
      params: {
        q: formattedCity,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { cod, message } = error.response.data as WeatherData;

        if (parseInt(cod, 10) === 404) {
          return { success: false, message: 'City not found. Please try again.' };
        } else {
          return { success: false, message: `Error ${cod}: ${message}` };
        }
      } else if (error.request) {
        return { success: false, message: 'Connection error. Check your internet.' };
      }
    }
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
};
