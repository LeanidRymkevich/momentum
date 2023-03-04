const time_wrapper = document.querySelector('.time');
const date_wrapper = document.querySelector('.date');
const greeting_wrapper = document.querySelector('.greeting');
const next_button = document.querySelector('.slider-next__button');
const prev_button = document.querySelector('.slider-prev__button');
const user_name_input = document.querySelector('.user-name');
const api_error = document.querySelector('.tag-error');

let current_background_thуme = '';
let current_background_num = 0;
let current_background_source = localStorage.getItem('image_source') || 'GitHub'; // or Unsplash API, or Flicr API
let current_background_tag; // tag for API
let lang = localStorage.getItem('chosen_lang') || 'ru'
let localization = lang === 'ru' ? 'ru-RU' : 'en-US';

// function for time showing and starting the other functions

function showTime() {
  const date = new Date();
  const current_time = date.toLocaleTimeString();
  time_wrapper.innerText = current_time;
  current_background_source = localStorage.getItem('image_source') || 'GitHub';
  const tag = localStorage.getItem('image_tag');
  changeBodyBackground(date, current_background_source, tag); // backgtound changing
  lang = localStorage.getItem('chosen_lang') || 'ru'
  localization = lang === 'ru' ? 'ru-RU' : 'en-US';
  showDate(date, localization); // date changing
  showGreeting(date, localization); // greeting changing
  setTimeout(showTime, 1000);
}

// date showing function

function showDate(date, localization = 'en-US') {
  const options = {weekday: 'long', month: 'long', day: 'numeric'};
  let current_date = date.toLocaleDateString(localization, options);
  current_date = current_date.split(' ')
                 .map(item => item.slice(0,1).toLocaleUpperCase() + item.slice(1,item.length))
                 .join(' ');
  date_wrapper.innerText = current_date;
}

// functions for greetings showing

function getTimeOfDay(date) {
  const current_hours = +date.getHours();
  const time_of_day = Math.floor(current_hours / 6);
  const day_parts = ['night', 'morning', 'afternoon', 'evening'];
  return day_parts[time_of_day];
}

function getGreeting(date, localization = 'en-US'){
  if(localization === 'ru-RU'){
    user_name_input.placeholder = '[Введите имя]';
  } else if (localization === 'en-US') {
    user_name_input.placeholder = '[Enter name]';
  }

  const day_part = getTimeOfDay(date);
  const greetings = {
    'night' : {'ru-RU' : 'Доброй ночи', 'en-US' : 'Good night'},
    'morning' : {'ru-RU' : 'Доброе утро', 'en-US' : 'Good morning'},
    'afternoon' : {'ru-RU' : 'Добрый день', 'en-US' : 'Good afternoon'},
    'evening' : {'ru-RU' : 'Добрый вечер', 'en-US' : 'Good evening'}, 
  };

  return greetings[day_part][localization];
}

function showGreeting(date, localization = 'en-US'){
  const greeting = `${getGreeting(date, localization)},`;
  greeting_wrapper.innerText = greeting;
}

// function for choosing background changing function according to user's choice

function changeBodyBackground(date, source = 'GitHub', tag, isUserAction){
  const whereChange = document.body;
  if(source === 'GitHub'){
    changeBackgroundWithGitHub(whereChange, date, 0, isUserAction);
  } else if (source === 'Unsplash API'){
    changeBackgroundWithUnsplash(whereChange, date, tag, isUserAction);
  } else if (source === 'Flicr API'){
    changeBackgroundWithFlicr(whereChange, date, tag, isUserAction);
  }
}

// random number in range

function getRandomNum(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// function for smooth image changing

function onlyBeforeLoadChange(target, path){ 
  const img = new Image();
  img.src = path;
  img.onload = () => {
    target.style.backgroundImage = `url('${path}')`;
  }
}

// function for creating the path to an image at GitHub storage

function createGitHubImagePath(number, day_part){
  const image_num = `${number}`.padStart(2, '0');
  const path = `https://github.com/LeanidRymkevich/stage1-tasks/blob/assets/images-webp/${day_part}/${image_num}_${number}_11zon.webp?raw=true`;
  return path;
}

// function for change background image using a GitHub storage

function changeBackgroundWithGitHub(target, date, user_background_num = 0, isUserAction = false){
  const day_part = getTimeOfDay(date);
  let image_num;
  let image_path;

  if(current_background_thуme !== day_part || isUserAction){
    image_num = getRandomNum(1, 20);
    current_background_thуme = day_part;
    current_background_num = image_num;
    image_path = createGitHubImagePath(image_num, day_part);
    onlyBeforeLoadChange(target, image_path);
  }

  if(user_background_num !== current_background_num && user_background_num){
    current_background_num = user_background_num;
    image_path = createGitHubImagePath(user_background_num, current_background_thуme);
    onlyBeforeLoadChange(target, image_path);
  }
}

// functions for change background image using the Unsplash API

async function changeBackgroundWithUnsplash(target, date, tag, isUserAction = false){
  if(!tag){
    tag = getTimeOfDay(date);
  }
  if(current_background_tag !== tag || isUserAction) {
    current_background_tag = tag;
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}`
                + '&client_id=FKTow1B1tglAWkApJRv67ul8nl6uzf9Wj2veCkKto6Q';
    const res = await fetch(url);
    const isOk = showError(localStorage.getItem('chosen_lang') || 'ru', res);
    if(!isOk){
      changeBackgroundWithGitHub(target, date, 0, true);
      return;
    }
    const data = await res.json();
    if(!data.urls || !data.urls.regular){
      showError(lang, undefined);
      changeBackgroundWithGitHub(target, date, 0, true);
      return;
    }
    
    const path = data.urls.regular; 
    onlyBeforeLoadChange(target, path);
  }
}

// functions for change background image using the Flicr API

async function changeBackgroundWithFlicr(target, date, tag, isUserAction = false){
  if(!tag){
    tag = getTimeOfDay(date);
  }
  if(current_background_tag !== tag || isUserAction) {
    current_background_tag = tag;
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search`
              + `&api_key=c9c9a3a7ec399949eebe2d022a50bf23&tags=${tag}`
              + '&extras=url_l&format=json&nojsoncallback=1';
    const res = await fetch(url);
    const isOk = showError(localStorage.getItem('chosen_lang') || 'ru', res);
    if(!isOk){
      changeBackgroundWithGitHub(target, date, 0, true);
      return;
    }
    const data = await res.json();
    const num = getRandomNum(0, data.photos.photo.length - 1);
    
    if(!data.photos.photo[num] || !data.photos.photo[num].url_l){
      showError(lang, undefined);
      changeBackgroundWithGitHub(target, date, 0, true);
      return;
    }

    const path = data.photos.photo[num].url_l;
    onlyBeforeLoadChange(target, path);
  }
}

// function to show an error if there are no such pictures with the selected tag 

function showError(lang, res){
  if(!res || !res.ok) {
    const error_message = lang === 'ru' ? 'Нет ответа от API или нет изображений по данному тегу!' 
                                        : 'There is no response from API or images on the tag entered!';
    api_error.textContent = error_message;
    api_error.classList.add('tag-error_visible');
    return false;
  } else {
    api_error.classList.remove('tag-error_visible');
    return true;
  }
}

// function for choosing next background image

function nextBackground(current_background_source) {
  // for source === GitHub
  if(current_background_source === 'GitHub'){
    let num = current_background_num + 1;
    if(num < 1){
      num = 20;
    }
    if(num > 20) {
      num = 1;
    }
    changeBackgroundWithGitHub(document.body ,new Date(), num);
  }

  if(current_background_source === 'Unsplash API'){
    changeBackgroundWithUnsplash(document.body ,new Date(), current_background_tag, true);
  }

  if(current_background_source === 'Flicr API'){
    changeBackgroundWithFlicr(document.body ,new Date(), current_background_tag, true);
  }
}

// function for choosing previous background image

function prevBackground(current_background_source) {
  // for source === GitHub
  if(current_background_source === 'GitHub'){
    let num = current_background_num - 1;
    if(num < 1){
      num = 20;
    }
    if(num > 20) {
      num = 1;
    }
    changeBackgroundWithGitHub(document.body ,new Date(), num);
  }

  if(current_background_source === 'Unsplash API'){
    changeBackgroundWithUnsplash(document.body ,new Date(), current_background_tag, true);
  }

  if(current_background_source === 'Flicr API'){
    changeBackgroundWithFlicr(document.body ,new Date(), current_background_tag, true);
  }
}

// function calling

showTime();

// adding listeners to the slider's next- and previous-button

next_button.addEventListener('click', () => nextBackground(current_background_source));
prev_button.addEventListener('click', ()=> prevBackground(current_background_source));

// username saving in the local storage before page closing or resetting

function setLocalStorage() {
  localStorage.setItem('user-name', user_name_input.value);
}
window.addEventListener('beforeunload', setLocalStorage);

// username getting from the local storage before page loading

function getLocalStorage() {
  if(localStorage.getItem('user-name')) {
    user_name_input.value = localStorage.getItem('user-name');
  }
}
window.addEventListener('load', getLocalStorage);

export default getRandomNum;
export {showDate, showGreeting, changeBodyBackground, current_background_tag};