"use client";
import { useState, useCallback } from "react";
import { fetchWeather } from "../services/weatherService";
import { WiDaySunny, WiRain, WiCloudy, WiSnow } from "react-icons/wi";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetchWeather = useCallback(async () => {
    setError("");
    setWeather(null);
    
    if (!city.trim()) {
      setError("Please enter the name of a city.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWeather(city);

      if (data.success === false) {
        setError(data.message);
      } else {
        setWeather(data.data);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [city]);

  const getBackground = () => {
    const main = weather?.weather?.[0]?.main?.toLowerCase();
    switch (main) {
      case "clear": return "from-yellow-400 to-orange-500";
      case "rain": return "from-gray-600 to-blue-700";
      case "clouds": return "from-gray-400 to-gray-700";
      case "snow": return "from-blue-300 to-white";
      default: return "from-blue-400 to-purple-600";
    }
  };

  const getWeatherIcon = () => {
    const main = weather?.weather?.[0]?.main?.toLowerCase();
    if (!main) return null;
    
    const icons = {
      clear: <WiDaySunny size={80} className="text-yellow-500" />,
      rain: <WiRain size={80} className="text-blue-500" />,
      clouds: <WiCloudy size={80} className="text-gray-400" />,
      snow: <WiSnow size={80} className="text-white" />,
    };

    return icons[main] || null;
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full bg-gradient-to-r ${getBackground()} text-white p-4 transition-all duration-500 min-h-screen`}>
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">🌤️ Weather in your city</h1>

      <div className="bg-white p-6 rounded-lg shadow-xl text-center text-black w-full max-w-md">
        <input
          type="text"
          placeholder="Enter a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 rounded-md border outline-none text-lg"
          disabled={loading}
        />
        <button 
          onClick={handleFetchWeather} 
          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-500 bg-white p-3 rounded-md shadow-md max-w-md text-center">{error}</p>}

      {weather && (
        <div className="mt-6 p-6 bg-white text-black rounded-lg shadow-lg text-center">
          {getWeatherIcon()}
          <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys?.country}</h2>
          <p className="text-lg">🌡️ Temperature: {weather.main?.temp}°C</p>
          <p className="text-lg">💧 Humidity: {weather.main?.humidity}%</p>
          <p className="text-lg">🌦️ {weather.weather?.[0]?.description}</p>
        </div>
      )}
    </div>
  );
}
