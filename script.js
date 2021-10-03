const openWeatherAPI = 'fc97c5a0c0302cc7c945bc04b4eeed5a';
const locationIQAPI = 'pk.f1d6c97eba37cafc6ae4199f9dba436d';

const currentDisplay = document.querySelector('.current-display'),
      currentCity = document.querySelector('current-city'),
      currentDesc = document.querySelector('current-desc'),
      currentTemp = document.querySelector('current-temp'),
      currentCoords = document.querySelector('minmax-temp');

let address;
let weatherData;
let coordinates = [];
const K = -273.15;

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

    // let dateTime = moment().unix(data.current.dt).format('MMMM Do YYYY, h:mm:ss a');
    // let dateTime = moment(data.current.dt).format('L');
    // console.log(dateTime);
    let unix_timestamp = data.current.dt;
    console.log(unix_timestamp);
    let date = new Date(unix_timestamp * 1000);
    let time = date.toTimeString().substring(0,5);
    // let hours = date.getHours();
    // let mins = "0" + date.getMinutes();
    // let secs = "0" + date.getSeconds();

    // var formattedTime = hours + ':' + mins.substr(-2) + ':' + secs.substr(-2);
    console.log(time);

    // current city 
    currentDisplay.innerHTML = 
    `
    <span id="current-city">${address.city}</span>
    <span id="current-desc">${data.current.weather[0].description}</span>
    <span id="current-temp">${Math.round(Number(data.current.temp) + K)}&#176;</span>
    `;

    // hourly forecast
    // for (let i = 0; i < 24; )

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

// function currentAPI(pos){
//     fetch(`https://api.openweathermap.org/data/2.5/lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data);
//         });
// }

