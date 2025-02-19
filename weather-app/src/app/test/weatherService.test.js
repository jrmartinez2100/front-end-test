import axios from "axios";
import { fetchWeather } from "../services/weatherService";

jest.mock("axios");

describe("fetchWeather", () => {
  const API_RESPONSE = {
    weather: [{ description: "clear sky" }],
    main: { temp: 25 },
    name: "London",
  };

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  test("Debe retornar datos del clima cuando la API responde correctamente", async () => {
    axios.get.mockResolvedValueOnce({ data: API_RESPONSE });

    const result = await fetchWeather("London");

    expect(result).toEqual({ success: true, data: API_RESPONSE });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      params: expect.objectContaining({ q: "London", units: "metric" }),
    });
  });

  test("Debe manejar error cuando la ciudad no existe (404)", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { cod: "404", message: "city not found" } },
    });

    const result = await fetchWeather("FakeCity");

    expect(result).toEqual({ success: false, message: "City not found. Please try again." });
  });

  test("Debe manejar errores internos de la API (500)", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { cod: "500", message: "Internal Server Error" } },
    });

    const result = await fetchWeather("London");

    expect(result).toEqual({ success: false, message: "Error 500: Internal Server Error" });
  });

  test("Debe manejar errores de conexión", async () => {
    axios.get.mockRejectedValueOnce({ request: {} });

    const result = await fetchWeather("London");

    expect(result).toEqual({ success: false, message: "Connection error. Check your internet." });
  });

  test("Debe lanzar error si no se proporciona una ciudad", async () => {
    await expect(fetchWeather("")).rejects.toThrow("You must enter a city.");
  });

  test("Debe lanzar error si faltan las variables de entorno", async () => {
    process.env.NEXT_PUBLIC_WEATHER_API_KEY = "";
    process.env.NEXT_PUBLIC_WEATHER_API_URL = "";

    await expect(fetchWeather("London")).rejects.toThrow(
      "API configuration missing. Check environment variables."
    );
  });
});
