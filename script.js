
// Weatherbit API key
const apiKey = "1a19d38705304dc89d5b2aa46cadda64";

// Get elements from html file
const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");


// current weather function
async function getCurrentWeather() {

    // Get the city entered by the user
    const city = cityInput.value.trim();

    // if user tries to search without entering city
    if (city === "") {
        weatherDiv.textContent = "Enter a city.";
        return;
    }

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

        // weather information that will be displayed
        weatherDiv.textContent =
            `City: ${weather.city_name}
Temperature: ${weather.temp}°F
Conditions: ${weather.weather.description}
Humidity: ${weather.rh}%
Wind Speed: ${weather.wind_spd} mph`;

    }
    catch (error) {
        console.error(error);
        weatherDiv.textContent = "Unable to retrieve weather information.";
    }
} // end getCurrentWeather()


// next 7 days weather forecast function
// same as getCurrentWeather except here you have to add a loop for the 
// 7 days that you are gathering information about
async function get7DayForecast() {

    // Get the city entered by the user
    const city = cityInput.value.trim();

    // if user tries to search without entering city
    if (city === "") {
        forecastDiv.textContent = "Please enter a city.";
        return;
    }

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

        // Loop through the forecast data
        for (let day of data.data) {

            // Create description for each day
            const forecastInfo = document.createElement("p");

            // weather information that will be displayed
            forecastInfo.textContent =
                `Date: ${day.datetime}
Temperature: ${day.temp}°F
Conditions: ${day.weather.description}
Humidity: ${day.rh}%`;

            // Add description to forecast section
            forecastDiv.appendChild(forecastInfo);
        }

    }
    catch (error) {
        console.error(error);
        forecastDiv.textContent = "Unable to retrieve forecast information.";
    }
} // end get7DayForecast()


// display both current and 7 day forecast when user searches city 
searchButton.addEventListener("click", () => {
    getCurrentWeather();
    get7DayForecast();
});

