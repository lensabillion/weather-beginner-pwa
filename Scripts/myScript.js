//Make suure sw are supported
if('serviceWorker'in navigator)
{
    window.addEventListener('load',() =>{
        navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log('Service worker available'))
        .catch(err => console.log(`Service :${err}`) )
    })
    console.log('servise worker supported');
}
//SELECT ELEMENTS
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temprature-description p");
const locationElement = document.querySelector(".location p");
const button =  document.querySelector(".button");
const inputvalue = document.querySelector(".inputValue");
//App data
const weather = { };

weather.temperature = {
    unit : "celsius"
}


const KELVIN = 273;
//API KEY
const key = "e473b0e2b1d68899e4785fd5428ef42b";


button.addEventListener('click',function(){
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputvalue.value+'&appid=e473b0e2b1d68899e4785fd5428ef42b')
  
  .then(response => response.json())
  .then(data =>{
    
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;

        
        localStorage.setItem("weather",JSON.stringify(weather));
    })
    .then(function(){
        
        displayWeather();
    })
  .catch(err => alert("Wrong City Name"));
  })
  
//Display Weather TO UI
function displayWeather(){
   
    var retrived = JSON.parse(localStorage.getItem("weather"));
    iconElement.innerHTML = `<img src="Icons/${retrived.iconId}.png"/>`;
    tempElement.innerHTML = `${retrived.temperature.value}°<span>C</span>`;
    descElement.innerHTML = retrived.description;
    locationElement.innerHTML = `${retrived.city},${retrived.country}`;
}


//C to F conversion
function celsiusToFahrenheit(temprature){
    return (temprature * 9/5) + 32;
}

//When the user clicks on the temperature element
tempElement.addEventListener("click",function(){
    if(weather.temperature.value === undefined) return;
    if(weather.temperature.unit === "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML =`${fahrenheit} ° <span>F</span>`;
        weather.temperature.unit ="fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value} °<span>C</span>`;
        weather.temperature.unit ="celsius";
    }
});

displayWeather();





















