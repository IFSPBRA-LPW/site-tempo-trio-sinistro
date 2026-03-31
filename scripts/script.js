import { API_KEY } from "./config.js";

async function fetchWeather(city) {
    const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&lang=pt`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar dados da API");
    }

    return response.json();
}

function adaptData(data) {
    return {
        city: data.location.name,
        country: data.location.country,
        date: data.location.localtime,

        temperature: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        precipitation: data.current.precip_mm,

        daily: data.forecast.forecastday.map(day => ({
            day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
            icon: "☁",
            max: Math.round(day.day.maxtemp_c),
            min: Math.round(day.day.mintemp_c),
        })),

        hourly: data.forecast.forecastday[0].hour.map(hour => ({
            time: hour.time.split(" ")[1],
            temp: Math.round(hour.temp_c),
        }))
    };
}

async function loadWeather(city) {
    try {
        console.log("Buscando cidade:", city);

        const data = await fetchWeather(city);
        console.log("RESPOSTA API:", data);

        const adapted = adaptData(data);

        orquestradora(adapted);

        localStorage.setItem("lastCity", city);

    } catch (error) {
        console.error(error);
        alert("Cidade não encontrada 😢");
    }
}

const input = document.querySelector(".search input");
const button = document.querySelector(".search button");

button.addEventListener("click", () => {
    const city = input.value;

    if (city) {
        loadWeather(city);
    }
});

window.addEventListener("load", () => {
    const lastCity = localStorage.getItem("lastCity") || "São Paulo";
    loadWeather(lastCity);
});


function renderBannerInfo(data) {

    const nameCity = document.querySelector(".card-main h2")
    const date = document.querySelector(".card-main p")
    const temperature = document.querySelector(".temperature")

    nameCity.textContent = `${data.city}, ${data.country}`
    date.textContent = data.date
    temperature.textContent = `${data.temperature}°`
}

function renderDayInfo(data){

    const boxes = document.querySelectorAll(".stats .box")

    const feelsLike = boxes[0].querySelector("h3")
    const humidity = boxes[1].querySelector("h3")
    const wind = boxes[2].querySelector("h3")
    const precipitation = boxes[3].querySelector("h3")

    feelsLike.textContent = `${data.feelsLike}°`
    humidity.textContent = `${data.humidity}%`
    wind.textContent = `${data.wind} km/h`
    precipitation.textContent = `${data.precipitation} mm`
}

function renderDaily(data) {

    const daysContainer = document.querySelector(".days")
    daysContainer.innerHTML = ""

    data.daily.forEach((day) => {

        const div = document.createElement("div")
        div.className = "day"

        div.innerHTML = `
            ${day.day}<br>
            ${day.icon}<br>
            ${day.max}°
        `

        daysContainer.appendChild(div)
    })
}

function renderHourly(data){

    const hourlyContainer = document.querySelector(".hourly")

    const oldHours = hourlyContainer.querySelectorAll(".hour")
    oldHours.forEach(hour => hour.remove())

    data.hourly.forEach((hour) => {

        const div = document.createElement("div")
        div.className = "hour"

        div.innerHTML = `${hour.time} ☁ ${hour.temp}°`

        hourlyContainer.appendChild(div)
    })
}

function orquestradora(cityWeather){

    renderBannerInfo(cityWeather)
    renderDayInfo(cityWeather)
    renderDaily(cityWeather)
    renderHourly(cityWeather)

}
