
function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name");

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) {
        document.getElementById("weatherResult").innerHTML = `<p>❌ City not found</p>`;
        return;
      }

      const { latitude, longitude, name, country } = data.results[0];
      getWeather(latitude, longitude, name, country);
    })
    .catch(() => alert("Error fetching city data"));
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      getWeather(latitude, longitude, "Your Location", "");
    });
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

function getWeather(lat, lon, cityName, country) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) {
        document.getElementById("weatherResult").innerHTML = `<p>❌ Weather data not available</p>`;
        return;
      }

      const weather = data.current_weather;

      const weatherHTML = `
        <h2>${cityName} ${country ? ", " + country : ""}</h2>
        <p>🌡️ Temperature: ${weather.temperature} °C</p>
        <p>💨 Wind Speed: ${weather.windspeed} km/h</p>
        <p>⏰ Time: ${weather.time}</p>
        <p>🌍 Latitude: ${lat}, Longitude: ${lon}</p>
      `;

      document.getElementById("weatherResult").innerHTML = weatherHTML;
    })
    .catch(() => alert("Unable to fetch weather data"));
}

