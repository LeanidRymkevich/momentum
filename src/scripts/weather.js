const weather_icon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weather_description = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city_input = document.querySelector('.city');
const error_block = document.querySelector('.weather-error');

let chosen_language = localStorage.getItem('chosen_lang') || 'ru'; // default language or 'en'
const default_city = chosen_language === 'ru' ? 'Минск' : 'Minsk';
const weather_update_timeout = 30 * 60 * 1000; // default weather update through each 30 minutes

// function to show weather in the chosen city

async function getWeather (city, lang = 'ru') {
  
  if(lang === 'ru'){
    city_input.placeholder = '[Введите город]';
  } else if(lang === 'en') {
    city_input.placeholder = '[Enter city]';
  }

  const url = 
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}` + 
  '&appid=cfc37ad5d8816299602e75c0ada34c89&units=metric';
  const res = await fetch(url);

  showErrorMessage(city, res, lang);
  if(!res.ok) return;

  const data = await res.json();
  weather_icon.className = 'weather-icon owf';
  weather_icon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weather_description.textContent = data.weather[0].description;
  wind.textContent = lang === 'ru' ? `Скорость ветра: ${Math.round(data.wind.speed)} м/c`
                                   : `Wind speed: ${Math.round(data.wind.speed)} m/s`;
  humidity.textContent = lang === 'ru' ? `Влажность: ${Math.round(data.main.humidity)}%`
                                       : `Humidity: ${Math.round(data.main.humidity)}%`;
  setTimeout(() => getWeather(city, lang), weather_update_timeout);
}

// calling the getWeather function to show weather on the page

if(localStorage.getItem('chosen_city')){
  getWeather(localStorage.getItem('chosen_city'), chosen_language);
} else {
  city_input.value = default_city;
  getWeather(default_city, chosen_language);
}

// functions for error showing

function showErrorMessage(city, res, lang = 'ru'){

  let hide;
  
  if(res.ok) {
    hide = false;
    error_block.textContent = '';
    hideWeatherDescription(hide);
    return;
  }

  hide = true;
  hideWeatherDescription(hide);

  const emptyStringError = {
    'ru' : 'Ошибка! Введена пустая строка! Пожалуйста, введите правильное название города!',
    'en' : 'Error! An empty string has been entered! Please, enter a correct city name!'
  };

  const incorrectCityNameError = {
    'ru' : `Ошибка! Нет данных для введенного города \"${city}\"! Пожалуйста, введите другое название города!`,
    'en' : `Error! There is no data for the city entered \"${city}\"! Please, enter another city name!`
  };

  if(!city){
    error_block.textContent = emptyStringError[lang];
  } else {
    error_block.textContent = incorrectCityNameError[lang];
  }
}

function hideWeatherDescription(hide){
  if(hide) {
    weather_icon.style.display = 'none';
    weather_description.style.display = 'none';
    temperature.style.display = 'none';
    wind.style.display = 'none';
    humidity.style.display = 'none';
  } else {
    weather_icon.style.display = 'block';
    weather_description.style.display = 'inline';
    temperature.style.display = 'inline';
    wind.style.display = 'block';
    humidity.style.display = 'block';
  }
}

// listener for city input to show weather for the city entered

city_input.addEventListener('change', (event) => {
  const city = event.target.value;
  getWeather(city, localStorage.getItem('chosen_lang') || 'ru');
  city_input.blur();
})

// city entered saving in the local storage before page closing or resetting

function setLocalStorage() {
  console.log(city_input.value);
  if(city_input.value === default_city) {
    if(localStorage.getItem('chosen_city')) {
      localStorage.removeItem('chosen_city');
      console.log(localStorage.getItem('chosen_city'));
      return;
    } else {
      return;
    }
  };
  localStorage.setItem('chosen_city', city_input.value);
}
window.addEventListener('beforeunload', setLocalStorage);

// city entered getting from the local storage before page loading

function getLocalStorage() {
  if(localStorage.getItem('chosen_city')) {
    city_input.value = localStorage.getItem('chosen_city');
  }
}
window.addEventListener('load', getLocalStorage);

export {getWeather, city_input};