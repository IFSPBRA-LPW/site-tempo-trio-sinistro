
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

orquestradora(cityWeather)