// for animation
import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/animejs/+esm';

// Weatherbit API key
const apiKey = "1a19d38705304dc89d5b2aa46cadda64";

// Get elements from html file
const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");
const weatherInfoDiv = document.getElementById("weatherInfo");

// current weather function
async function getCurrentWeather() {

    // Get the city entered by the user
    const city = cityInput.value.trim();

    // API request
    const params = new URLSearchParams({
        city: city,
        key: apiKey,
        units: "I" // "I" is for fahrenheit
    });

    const url = `https://api.weatherbit.io/v2.0/current?${params}`;

    // submit request and if can't obtain information display error message from catch
    try {
        // Send a request to Weatherbit
        const response = await fetch(url);

        // verify request
        if (!response.ok) {
            throw new Error("Weather request failed: " + response.status);
        }

        // Convert the response into JSON
        const data = await response.json();

        // Get the first weather observation
        const weather = data.data[0];

        // weather information that will be displayed using textContent
        weatherInfoDiv.textContent =
            `City: ${weather.city_name}
Temperature: ${weather.temp}°F
Conditions: ${weather.weather.description}
Humidity: ${weather.rh}%
Wind Speed: ${weather.wind_spd} mph`;

    }
    catch (error) {
        console.error(error);
        weatherInfoDiv.textContent = "Unable to retrieve weather information.";
    }
} // end getCurrentWeather()


// next 7 days weather forecast function
// same as getCurrentWeather except here you have obtain weather for
// 7 days and separate the information for display
async function get7DayForecast() {

    // Get the city entered by the user
    const city = cityInput.value.trim();

    // API request for 7 days
    const params = new URLSearchParams({
        city: city,
        key: apiKey,
        units: "I",
        days: 7
    });

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?${params}`;

    // submit request and if can't obtain information display error message from catch
    try {
        // submit request
        const response = await fetch(url);

        // verify request
        if (!response.ok) {
            throw new Error("Forecast request failed: " + response.status);
        }

        // Convert the response into JSON
        const data = await response.json();

        // Clear the forecast (this is used when doing multiple searches)
        forecastDiv.innerHTML = "";

        forecastDiv.innerHTML = data.data.map(day => `
            <div class="forecast-day">
                <h3>${day.valid_date}</h3>
                <p>Temperature: ${day.temp}°F</p>
                <p>Conditions:
                ${day.weather.description}</p>
                <p>Humidity: ${day.rh}%</p>
            </div>
        `).join("");

    }
    catch (error) {
        console.error(error);
        forecastDiv.textContent = "Unable to retrieve forecast information.";
    }
} // end get7DayForecast()


// display both current and 7 day forecast when user searches city 
searchButton.addEventListener("click", () => {
    // if search is empty and user trys to search
    if(cityInput.value.trim() == ""){
        weatherInfoDiv.textContent = "Enter a city.";
        forecastDiv.textContent = "Enter a city";
        return;
    }

    getCurrentWeather();
    get7DayForecast();
});

// color animation that is basically a breathing effect that shifts the color
// hue from yellow to orange constantly
animate('.row-1-item-1, .row-1-item-2, .row-2', {
    backgroundColor: [
        'rgba(219, 216, 0, 0.65)',
        'rgba(252, 149, 32, 0.65)'
    ],

    duration: 2000,
    delay: stagger(300),
    loop: true,
    alternate: true
});