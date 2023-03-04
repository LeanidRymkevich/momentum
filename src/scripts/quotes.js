import getRandomNum from './date&time.js'

const quotes_button = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

let lang = localStorage.getItem('chosen_lang') || 'ru';
let quote_index;

// function for quote showing

async function showQuote(lang, index = -1) {

  const path = 'src/json/quotes.json';
  const res = await fetch(path);
  const data = await res.json();

  if(index === -1) {
    index = getRandomNum(0, data[lang].length - 1);
  }
  quote_index = index;

  const json_quote = data[lang][index].quote;
  const json_author = data[lang][index].author;

  quote.textContent = json_quote;
  author.textContent = json_author;
}

showQuote(lang);

// rotating arrows in the quotes_button and qoute showing

quotes_button.addEventListener('click', (event) => {
  if(event.target.style.transform){
    const number = +event.target.style.transform.match(/\d+/);
    const deg = number + 180;
    event.target.style.transform = 'rotate(' + deg + 'deg)';
  } else {
    event.target.style.transform = 'rotate(180deg)';
  }
  showQuote(localStorage.getItem('chosen_lang') || 'ru');
});

// function for the quote language change

function changeQuoteLang(lang) {
  showQuote(lang, quote_index);
}

export {changeQuoteLang};