import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WeatherApp from "../components/weatherApp"; 
import { fetchWeather } from "../services/weatherService";

// Mockeamos fetchWeather para evitar llamadas reales a la API
jest.mock("../services/weatherService");

describe("WeatherApp Component", () => {
  test("Renderiza correctamente el componente", () => {
    render(<WeatherApp />);
    expect(screen.getByText(/weather in your city/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter a city/i)).toBeInTheDocument();
  });

  test("Muestra un mensaje de error si el input está vacío", async () => {
    render(<WeatherApp />);
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.click(searchButton);

    expect(await screen.findByText(/please enter the name of a city/i)).toBeInTheDocument();
  });

  test("Simula una búsqueda exitosa y muestra los datos del clima", async () => {
    const mockWeatherData = {
      name: "London",
      sys: { country: "GB" },
      main: { temp: 20, humidity: 60 },
      weather: [{ main: "Clear", description: "clear sky" }],
    };

    fetchWeather.mockResolvedValueOnce({ success: true, data: mockWeatherData });

    render(<WeatherApp />);
    const input = screen.getByPlaceholderText(/enter a city/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "London" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/london, gb/i)).toBeInTheDocument();
      expect(screen.getByText(/🌡️ temperature: 20°c/i)).toBeInTheDocument();
      expect(screen.getByText(/💧 humidity: 60%/i)).toBeInTheDocument();
      expect(screen.getByText(/🌦️ clear sky/i)).toBeInTheDocument();
    });
  });

  test("Muestra mensaje de error si la ciudad no existe", async () => {
    fetchWeather.mockResolvedValueOnce({ success: false, message: "City not found. Please try again." });

    render(<WeatherApp />);
    const input = screen.getByPlaceholderText(/enter a city/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "FakeCity" } });
    fireEvent.click(searchButton);

    expect(await screen.findByText(/city not found. please try again/i)).toBeInTheDocument();
  });

  test("Maneja el estado de carga mientras obtiene datos", async () => {
    fetchWeather.mockResolvedValueOnce({
      success: true,
      data: {
        name: "Paris",
        sys: { country: "FR" },
        main: { temp: 18, humidity: 55 },
        weather: [{ main: "Clouds", description: "overcast clouds" }],
      },
    });

    render(<WeatherApp />);
    const input = screen.getByPlaceholderText(/enter a city/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "Paris" } });
    fireEvent.click(searchButton);

    expect(screen.getByRole("button")).toHaveTextContent(/loading/i);

    await waitFor(() => {
      expect(screen.getByText(/paris, fr/i)).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent(/search/i);
    });
  });
});
