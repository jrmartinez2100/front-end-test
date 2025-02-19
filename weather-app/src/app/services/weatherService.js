import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

export const fetchWeather = async (city) => {
  if (!city) throw new Error("You must enter a city.");
  if (!API_KEY || !BASE_URL) {
    throw new Error("API configuration missing. Check environment variables.");
  }

  const formattedCity = city.trim();

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: formattedCity,
        appid: API_KEY,
        units: "metric",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      const { cod, message } = error.response.data;
      
      if (parseInt(cod, 10) === 404) {
        return { success: false, message: "City not found. Please try again." };
      } else {
        return { success: false, message: `Error ${cod}: ${message}` };
      }
    } else if (error.request) {
      return { success: false, message: "Connection error. Check your internet." };
    } else {
      return { success: false, message: "An unexpected error occurred. Please try again later." };
    }
  }
};
