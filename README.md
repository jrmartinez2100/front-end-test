Requisitos previos

 Node.js (versión 16 o superior)
 npm o yarn (gestor de paquetes)
 Cuenta en OpenWeather API (para obtener la API Key)

Instalación del proyecto
git clone https://github.com/jrmartinez2100/front-end-test.git
una vez clonado el repositorio entrar al proyecto weather-app

Configurar las variables de entorno
Crea un archivo .env.local en la raíz del proyecto y agrega las siguientes líneas:

NEXT_PUBLIC_WEATHER_API_KEY=TU_API_KEY
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather

Reemplaza TU_API_KEY con tu clave de OpenWeather. Si no tienes una, regístrate en https://openweathermap.org/api y obtén una.

Instalar dependencias
npm install

Ejecutar la aplicación

  npm run dev
  
Pruebas automáticas con Jest y React Testing Library

npm test
