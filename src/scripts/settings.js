import {changeQuoteLang} from './quotes.js'
import {getWeather, city_input} from './weather.js';
import {showDate, showGreeting, changeBodyBackground, current_background_tag} from './date&time.js';
import changeTodoLang from './todo.js';

const settings_menu = document.querySelector('.settings__menu');
const settings__button = document.querySelector('.settings__button');

const settings_header = document.querySelector('.settings__header');
const lang_select = document.getElementById('language');
const lang_label = document.querySelector('.settings__language label');
const ru_select_option = lang_select[0];
const en_select_option = lang_select[1];
const settings_items_names = {
  header : {ru : 'Настройки', en : 'Settings'},
  language : {ru : 'Язык:', en : 'Language:'},
  language_ru : {ru : 'Русский', en : 'Russian'},
  language_en : {ru : 'Английский', en : 'English'},
  background_source : {ru : 'Источник фонового изображения:', en : 'Background image source:'},
  image_tag_placeholder : {ru : 'Введите тег фонового изображения', en : 'Enter background image tag'},
  visible_blocks_header : {ru : 'Видимые блоки:', en : 'Visible blocks:'},
  player : {ru : 'Плеер', en : 'Player'},
  weather : {ru : 'Погода', en : 'Weather'},
  time : {ru : 'Время', en : 'Time'},
  date : {ru : 'Дата', en : 'Date'},
  greetens : {ru : 'Приветсвие', en : 'Greetens'},
  quotes : {ru : 'Цитаты', en : 'Quotes'},
}

const background_select = document.getElementById('backgroud-source');
const background_source_label = document.querySelector('.settings__backgroud-source label');
const image_tag = document.querySelector('.image-tag');
const api_error = document.querySelector('.tag-error');

const visible_blocks_header = document.querySelector('.visible-blocks-header');
const player_block_visib = document.querySelector('.player-block');
const weather_block_visib = document.querySelector('.weather-block');
const time_block_visib = document.querySelector('.time-block');
const date_block_visib = document.querySelector('.date-block');
const greetings_block_visib = document.querySelector('.greetings-block');
const quotes_block_visib = document.querySelector('.quotes-block');
const visible_blocks_inputs = document.querySelector('.settings__visible-blocks').getElementsByTagName('input');

const settings_items = { // default settings
  lang : localStorage.getItem('chosen_lang') || 'ru',
  hidden_blocks : localStorage.getItem('hidden_blocks') ? localStorage.getItem('hidden_blocks').split(' ') : [], 
  image_source : localStorage.getItem('image_source') || 'GitHub',
  image_tag : localStorage.getItem('image_tag')
};

// initial text filling of the setting menu according to chosen language

settings_header.textContent = settings_items_names.header[settings_items.lang];

lang_select.value = localStorage.getItem('chosen_lang') || 'ru';
lang_label.textContent = settings_items_names.language[settings_items.lang];
ru_select_option.textContent = settings_items_names.language_ru[settings_items.lang];
en_select_option.textContent = settings_items_names.language_en[settings_items.lang];

background_select.value = localStorage.getItem('image_source') || 'GitHub';
background_source_label.textContent = settings_items_names.background_source[settings_items.lang];
image_tag.placeholder = settings_items_names.image_tag_placeholder[settings_items.lang];
image_tag.value = settings_items.image_tag;
if(!localStorage.getItem('image_source') || localStorage.getItem('image_source') !== 'GitHub'){
  image_tag.classList.add('image-tag_opened');
  }else {
    image_tag.classList.remove('image-tag_opened');
}

visible_blocks_header.textContent = settings_items_names.visible_blocks_header[settings_items.lang];
player_block_visib.textContent = settings_items_names.player[settings_items.lang];
weather_block_visib.textContent = settings_items_names.weather[settings_items.lang];
time_block_visib.textContent = settings_items_names.time[settings_items.lang];
date_block_visib.textContent = settings_items_names.date[settings_items.lang];
greetings_block_visib.textContent = settings_items_names.greetens[settings_items.lang];
quotes_block_visib.textContent = settings_items_names.quotes[settings_items.lang];

initBlockShow(settings_items.hidden_blocks);

// listeners for closing the settings menu on button click or click outside the menu area

settings__button.addEventListener('click', () => {
  settings__button.classList.toggle('settings__button_active');
  settings_menu.classList.toggle('settings__menu_active');
});

document.addEventListener('click', (event) => {
  if(event.target !== settings__button &&
     settings_menu.classList.contains('settings__menu_active')){
      if(! event.target.closest('.settings__menu')){
        settings_menu.classList.remove('settings__menu_active');
        settings__button.classList.remove('settings__button_active');
      }
     }
})

// listener for language change according to chosen in input form

lang_select.addEventListener('change', () => {
  settings_items.lang = lang_select.value;
  localStorage.setItem('chosen_lang', settings_items.lang);
  changeLang(settings_items.lang);
});

// listener for language change according to chosen in input form

background_select.addEventListener('change', () => {
  settings_items.image_source = background_select.value;
  if(settings_items.image_source === 'Unsplash API' || settings_items.image_source === 'Flicr API'){
    image_tag.classList.add('image-tag_opened');
  }else {
    image_tag.classList.remove('image-tag_opened');
  }
  localStorage.setItem('image_source', settings_items.image_source);
  changeImageSource(settings_items.image_source);
});

// function for the language changing

function changeLang(lang){
  changeSettingLang(lang);
  changeQuoteLang(lang);
  getWeather(city_input.value, lang);
  if(city_input.value === 'Minsk' || city_input.value === 'Минск') {
    city_input.value = lang === 'ru' ? 'Минск' : 'Minsk';
  }
  const localization = lang === 'ru' ? 'ru-RU' : 'en-US'
  const date = new Date();
  showDate(date, localization);
  showGreeting(date, localization);
}

// function for changing image source

function changeImageSource(source) {
  api_error.classList.remove('tag-error_visible');
  changeBodyBackground(new Date(), source, settings_items.image_tag, true);
  settings_items.image_source = source;
}

// function for changing language in the settings menu

function changeSettingLang(lang){
  settings_header.textContent = settings_items_names.header[lang];

  lang_label.textContent = settings_items_names.language[lang];
  ru_select_option.textContent = settings_items_names.language_ru[lang];
  en_select_option.textContent = settings_items_names.language_en[lang];

  background_source_label.textContent = settings_items_names.background_source[settings_items.lang];
  image_tag.placeholder = settings_items_names.image_tag_placeholder[settings_items.lang];
  if(api_error.classList.contains('tag-error_visible')){
    const error_message = lang === 'ru' ? `Нет изображений с тегом '${current_background_tag}' или пустой ответ от API!` :
                          `There are no pictures with such a tag '${current_background_tag}' or empty response from API!`;
    api_error.textContent = error_message;
  }

  visible_blocks_header.textContent = settings_items_names.visible_blocks_header[settings_items.lang];
  player_block_visib.textContent = settings_items_names.player[settings_items.lang];
  weather_block_visib.textContent = settings_items_names.weather[settings_items.lang];
  time_block_visib.textContent = settings_items_names.time[settings_items.lang];
  date_block_visib.textContent = settings_items_names.date[settings_items.lang];
  greetings_block_visib.textContent = settings_items_names.greetens[settings_items.lang];
  quotes_block_visib.textContent = settings_items_names.quotes[settings_items.lang];

  changeTodoLang(lang);
}

// function for default tag change 

function changeImageTag(tag){
  if(!tag) return;
  changeBodyBackground(new Date(), settings_items.image_source, tag, true);
}

// listener to change the background image according to tag entered

image_tag.addEventListener('change', () => {
  settings_items.image_tag = image_tag.value;
  localStorage.setItem('image_tag', image_tag.value);
  changeImageTag(image_tag.value);
  image_tag.blur();
});

// function to add listeners to input in the block visibility settings

function showBlock(input) {
  input.addEventListener('change', () => {
    const block = document.querySelector(`.${input.value}`);
    if(input.checked) {
      block.classList.remove('settings-hide');
      settings_items.hidden_blocks = settings_items.hidden_blocks.filter(item => item !== input.value);
    } else {
      block.classList.add('settings-hide');
      settings_items.hidden_blocks.push(input.value);
    }
  })
}

for(let item of visible_blocks_inputs){
  showBlock(item);
}

// function for initial blocks showing

function initBlockShow(block_names) {
  if(!block_names.length) return;
  
  let block;
  let input;
  for(let item of block_names) {
    block = document.querySelector(`.${item}`);
    block.classList.add('settings-hide');
    input = document.querySelector(`[value=${item}]`);
    input.checked = false;
  }
}

// save hidden blocks in the local storage

window.addEventListener('beforeunload', () => {
  localStorage.setItem('hidden_blocks', settings_items.hidden_blocks.join(' '));
  console.log(settings_items.hidden_blocks);
});

// listener to add animation when the page has been already loaded

window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});