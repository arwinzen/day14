const openWeatherAPI = 'fc97c5a0c0302cc7c945bc04b4eeed5a';
const locationIQAPI = 'pk.f1d6c97eba37cafc6ae4199f9dba436d';

const searchCity = document.querySelector('form'),
      currentDisplay = document.querySelector('.current-display'),
      currentCity = document.querySelector('.current-city'),
      currentDesc = document.querySelector('.current-desc'),
      currentTemp = document.querySelector('.current-temp'),
      currentCoords = document.querySelector('.minmax-temp'),
      hourlyForecast = document.querySelector('.hourly-forecast'),
      sevenDayForecast = document.querySelector('.sevenday-forecast');

let address;
let weatherData;
let coordinates = [];

function convertCelsius(K){
    return Math.round(Number(K) - 273.15);
}

// const K = -273.15;

function convertTime(timestamp){
    let now = new Date(timestamp * 1000);
    let dd = String(now.getDate()).padStart(2, '0');
    let mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = now.getFullYear();

    let datetime = {};
    let date = dd + '/' + mm + '/' + yyyy;
    datetime["date"] = date;
    let time = now.toTimeString().substring(0,5);
    datetime["time"] = time;

    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day = days[now.getDay()];
    datetime["day"] = day;

    return datetime;
}

function getCoordinates(){
    let options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(position){
        let lat = (position.coords.latitude);
        let lon = (position.coords.longitude);
        coordinates.push(lat, lon);
        // console.log(coordinates);
        getCity(lat, lon);
    }

    function error(err){
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function weatherForecast(data){
    console.log(address);
    console.log(coordinates);
    console.log(data);

    // console.log(dateTime);
    let timestamp = data.current.dt;
    // console.log(unix_timestamp);
    // let now = new Date(unix_timestamp * 1000);

    datetime = convertTime(timestamp);
    console.log(datetime);

    // function to retrieve icons
    function getIcons(frequency, i){
        // icon url
        // console.log(frequency, i);
        // console.log(data[frequency][i].weather[0].icon);
        let iconCode = data[frequency][i].weather[0].icon;
        // console.log(iconCode);
        let iconURL = `http://openweathermap.org/img/w/${iconCode}.png`;
        let icon = document.querySelector(`.${frequency}-icon${i}`);
        icon.setAttribute("src", iconURL);
        // console.log(icon);
    }


    // current city 
    currentDisplay.innerHTML = 
    `
    <span id="current-city">${address.city}</span>
    <span id="current-desc">${data.current.weather[0].description}</span>
    <span id="current-temp">${convertCelsius((data.current.temp))}&#176;</span>
    <span id="current-max-min">H:${convertCelsius(data.daily[0].temp.max)}&#176; L:${convertCelsius(data.daily[0].temp.min)}&#176;</span>
    `;

    // hourly forecast
    console.log("hourly forecast section");
    for (let i = 1; i < 25; i++){
        let hourlyTimestamp = data.hourly[i].dt;
        datetime = convertTime(hourlyTimestamp);
        // console.log(datetime);
        hourlyForecast.innerHTML += 
        `
        <div class="hourly">
            <span class="hourly-time">${datetime.time}</span>
            <img class="hourly-icon${i}" alt="${data.hourly[i].weather[0].description}">
            <span class="hourly-temp">${convertCelsius(data.hourly[i].temp)}&#176;</span>
        </div>
        `;
        frequency = "hourly";
        getIcons(frequency, i);
    }

    // daily forecast
    console.log("daily forecast section");
    for (let i = 1; i < 8; i++){
        let dailyTimestamp = data.daily[i].dt;
        // console.log(convertTime(dailyTimestamp));
        datetime = convertTime(dailyTimestamp);
        // console.log(datetime);
        sevenDayForecast.innerHTML += 
        `
        <div class="daily-forecast">
            <span class="daily-day">${datetime.day}</span>
            <img class="daily-icon${i}" alt="${data.daily[i].weather[0].description}">
            <span class="daily-max">${convertCelsius(data.daily[i].temp.max)}&#176;</span>
            <span class="daily-min">${convertCelsius(data.daily[i].temp.min)}&#176;</span>
        </div>
        `;

        let frequency = "daily";
        getIcons(frequency, i);

    }

}

function getCity(lat, lon){
    // let lat = coordinates.lat;
    // let lon = coordinates.lon;
    fetch(`https://us1.locationiq.com/v1/reverse.php?key=${locationIQAPI}&lat=${lat}&lon=${lon}&format=json`)
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then((data) => {
            address = data.address;
            callWeatherAPI(lat, lon);
            return;
        })
        .catch((err) => {
            console.error(err);
        });
}

function callWeatherAPI(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=fc97c5a0c0302cc7c945bc04b4eeed5a`)
        .then(res => res.json())
        .then(data => {
            weatherData = data;
            weatherForecast(data);
            // console.log(data);
        })
}

function searchCity(city){
    fetch(`https://us1.locationiq.com/v1/search.php?key=${locationIQAPI}&q=${city}&format=json`)
    .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    })
    .then((data) => {
        address = data.address;
        callWeatherAPI(lat, lon);
        return;
    })
    .catch((err) => {
        console.error(err);
    });
}



// function currentAPI(pos){
//     fetch(`https://api.openweathermap.org/data/2.5/lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data);
//         });
// }

