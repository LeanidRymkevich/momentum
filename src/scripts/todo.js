import todo_sublist_item from './todo_sublist_item.js';

const todo_button = document.querySelector('.todo__button');
const todo_window = document.querySelector('.todo__window');
const todo_body = todo_window.querySelector('.todo__window-body');

const accordion_button = document.querySelector('.accordion__button');
const accordion_list = document.querySelector('.accordion__list');
const accordion_chosen_item = document.querySelector('.accordion__chosen-item');

const done_list = document.querySelector(`.sublist[data-item-name=Done]`);

const footer_input = document.querySelector('.todo__window-footer input');

const names = {
  accordion_done_item : {ru : 'Выполнено', en : 'Done'},
  accordion_today_item : {ru : 'Сегодня', en : 'Today'},
  accordion_inbox_item : {ru : 'Входящие', en : 'Inbox'},
  dropdown_delete_item : {ru : 'Удалить', en : 'Delete'},
  dropdown_edit_item : {ru : 'Править', en : 'Edit'},
  input_placeholder : {ru : 'Введите заметку', en : 'Enter your note'}
};

let chosen_tab = 'Today'; // the open tab, 'Today' by default
let sublist;

let list_item; // in the todo body sublist
let hasClass = false; // flag for dropdown menu in the focused item

// function for lang of the TODO changing

function changeTodoLang(lang) {
  const acc_chosen_item = document.querySelector('.accordion__chosen-item');
  const acc_item_today = document.querySelector('.accordion__item[data-item-name=Today] span');
  const acc_item_inbox = document.querySelector('.accordion__item[data-item-name=Inbox] span');
  const acc_item_done = document.querySelector('.accordion__item[data-item-name=Done] span');
  const dropdowns = document.querySelectorAll('.sublist-item__menu');
  const footer_input = document.querySelector('.todo__window-footer input');

  let del_opt;
  let edit_opt;

  acc_chosen_item.textContent = names.accordion_today_item[lang];
  acc_item_today.textContent = names.accordion_today_item[lang];
  acc_item_inbox.textContent = names.accordion_inbox_item[lang];
  acc_item_done.textContent = names.accordion_done_item[lang];
  footer_input.placeholder = names.input_placeholder[lang];

  for(let item of dropdowns){
    del_opt = item.querySelector('.delete-option');
    edit_opt = item.querySelector('.edit-option');

    del_opt.textContent = names.dropdown_delete_item[lang];
    edit_opt.textContent = names.dropdown_edit_item[lang];
  }
}

changeTodoLang(localStorage.getItem('chosen_lang') || 'ru');

export default changeTodoLang;

// listener to press the TODO button 

todo_button.addEventListener('click', () => {
  todo_button.classList.toggle('todo__button_active');
  todo_window.classList.toggle('todo__window_active');
});

// function for accordion opening 

function openAccordion() {
  accordion_button.classList.add('accordion__button_active')
  setTimeout(() => accordion_list.classList.add('accordion__list_active'), 200);
}

// function for accordion closing 

function closeAccordion() {
  accordion_list.classList.remove('accordion__list_active');
  setTimeout(() => accordion_button.classList.remove('accordion__button_active'), 200);
}

// function for sublist opening

function openSublist(sublist_name) {
  const sublist = document.querySelector(`.body-list__item[data-item-name=${sublist_name}]`);
  sublist.classList.add('body-list__item_active');
  chosen_tab = sublist_name;
}

// function for sublist closing

function closeSublist(sublist_name) {
  const sublist = document.querySelector(`.body-list__item[data-item-name=${sublist_name}]`);
  sublist.classList.remove('body-list__item_active');
}

// function to open dropdown menu

function openDropdown(list_item) {
  const list_item_menu = list_item.querySelector('.sublist-item__menu');
  const list_item_button = list_item.querySelector('.sublist-item__button');
  hasClass = true;

  list_item_menu.classList.add('sublist-item__menu_active');
  list_item_button.classList.add('sublist-item__button_active');
}

// function to close dropdown menu

function closeDropdown(list_item) {
  const list_item_menu = list_item.querySelector('.sublist-item__menu');
  const list_item_button = list_item.querySelector('.sublist-item__button');

  list_item_menu.classList.remove('sublist-item__menu_active');
  list_item_button.classList.remove('sublist-item__button_active');

  list_item = null;
  hasClass = false;
}

// function to edit item from the open tab

function editTabItem(item){
  const target = item.querySelector('.sublist-item__content span');
  target.contentEditable = true;

  target.addEventListener('blur', () => {
    target.contentEditable = false;
  })
}

// listener to todo window

todo_window.addEventListener('click', (event) => {
  // open-close the accordion menu

  if(event.target.closest('.accordion__button') && !accordion_list.classList.contains('accordion__list_active')){
    changeCounter();
    openAccordion();
  } else if(event.target.closest('.accordion__button') && accordion_list.classList.contains('accordion__list_active')){
    closeAccordion();
  } else if(!event.target.closest('.todo__window-header')) {
    closeAccordion();
  }

  // choose list to show

  if(event.target.closest('.accordion__list li')){
    const acc_item = event.target.closest('.accordion__list li');
    const tab_name = acc_item.dataset.itemName;
    accordion_chosen_item.textContent = acc_item.querySelector('.accordion__item-name').textContent;
    closeAccordion();
    closeSublist(chosen_tab);
    const element = document.querySelector(`.body-list__item[data-item-name=${tab_name}]`);
    const delay = +getComputedStyle(element).transitionDuration.slice(0, -1); // in seconds
    setTimeout(() => openSublist(tab_name), delay * 1000);
  }

  // open-close the list item dropdown
  
  sublist = document.querySelector(`.sublist[data-item-name=${chosen_tab}]`);

  if(sublist.querySelectorAll('.sublist-item').length) {
    if(event.target.closest('.sublist-item__button') && !hasClass) {
      list_item = event.target.closest('.sublist-item');
      openDropdown(list_item);
    } else if(event.target.closest('.sublist-item__button') && hasClass) {

      if(event.target.closest('.sublist-item') === list_item) {
        closeDropdown(list_item);
      } else {
        closeDropdown(list_item);
        list_item = event.target.closest('.sublist-item');
        openDropdown(list_item);
      }

    } else if(!event.target.closest('ul.sublist-item__menu') && list_item) {
      closeDropdown(list_item);
    }
  }

  // remove an item in the open tab

  if(event.target.classList.contains('delete-option')) {
    const item = list_item;
    item.remove();
  }

  // edit an item in the open tab

  if(event.target.classList.contains('edit-option')) {
    const item = list_item;
    closeDropdown(list_item);
    editTabItem(item);
  }
});

// function to create a tab_item

function createTabItem(text, isChecked = false, tab_name = chosen_tab) {
  const element = document.createElement('li');
  const li_classes = ['body-sublist__item', 'sublist-item'];
  const lang = localStorage.getItem('chosen_lang');
  const delete_option_name =  lang ? names.dropdown_delete_item[lang] : names.dropdown_delete_item.ru;
  const edit_option_name =  lang ? names.dropdown_edit_item[lang] : names.dropdown_edit_item.ru;
  let span;
  let input;
  let del_opt;
  let edit_opt;

  li_classes.forEach(item => element.classList.add(item));
  element.innerHTML = todo_sublist_item;
  element.dataset.itemName = tab_name;

  input = element.querySelector('.sublist-item__content input'); 
  span = element.querySelector('.sublist-item__content span');
  del_opt = element.querySelector('.delete-option');
  edit_opt = element.querySelector('.edit-option');
  span.textContent = text;

  if(JSON.parse(isChecked)) {
    span.classList.add('checked');
    input.checked = JSON.parse(isChecked);
  }
  del_opt.textContent = delete_option_name;
  edit_opt.textContent = edit_option_name;

  return element;
}

// listener to add a list item to the todo body

footer_input.addEventListener('change', (event) => {
  const value = event.target.value;
  let element;
  if(chosen_tab === 'Done') {
    element = createTabItem(value, 'true');
  } else {
    element = createTabItem(value);
  }

  event.target.value = '';
  event.target.blur();

  const sublist = document.querySelector(`.sublist[data-item-name=${chosen_tab}]`);
  sublist.append(element); 
});


// function to change counter in the accordion list items

function changeCounter() {
  const tabs = todo_body.querySelectorAll('.sublist');
  const accordion_list = document.querySelector('.accordion__list');

  let tab_name;
  let acc_item;
  let target;
  let counter;

  for(let item of tabs){
    tab_name = item.dataset.itemName;
    acc_item = accordion_list.querySelector(`[data-item-name=${tab_name}]`);
    target = acc_item.querySelector('.accordion__item-counter');
    counter = item.querySelectorAll('.sublist-item').length;
    target.textContent = counter;
  }
}

// listener to save todo options and info before the window unload

window.addEventListener('beforeunload', saveTodoInfo);

//function to save todo options and info before the window unload

function saveTodoInfo() {
  const tabs = todo_body.querySelectorAll('.sublist');
  const tab_names = [];
  
  tabs.forEach(item => tab_names.push(item.dataset.itemName));
  localStorage.setItem('todo_tabs', tab_names);

  let key;
  let value ;
  let tab_items;
  /*
    the pattern of tab representation in the local storage:
    key      | value
    _________|___________________________________________________________________________
    tab_name | [tab_item_text isChecked tab_name] [tab_item_text isChecked tab_name] ....
    _________|___________________________________________________________________________
  */ 

  for(let item of tabs){
    key = item.dataset.itemName;
    tab_items = item.querySelectorAll('.sublist-item');
    value = getTabStringRepresentation(tab_items);
    localStorage.setItem(key, value);
  }
}

// function to represent tab_item as a string

function getStringRepresentation(tab_item) {
  const tab_item_text = tab_item.querySelector('.sublist-item__content span').textContent;
  const isChecked = tab_item.querySelector('.sublist-item__content input').checked;
  const tab_name = tab_item.dataset.itemName;
  return `[${tab_item_text} ${isChecked} ${tab_name}]`;
}

// function to represent tab_item as a string

function getTabStringRepresentation(tab_items) {
  let value = '';
  tab_items.forEach(item => value += `${getStringRepresentation(item)} `);
  return value.trim();
}

// listener to load saved options and info in the page load time

window.addEventListener('load', getTodoInfo);

// function to get todo info from the local storage

function getTodoInfo() {
  const tab_names = localStorage.getItem('todo_tabs').split(',');
  const string_tabs = {};

  for(let item of tab_names) {
    string_tabs[item] = localStorage.getItem(item);
  }
  
  for(let key in string_tabs) {
    if(string_tabs[key]){
      tabFill(key, string_tabs[key]);
    }
  }
}

// function to fill todo tab with data from string representation

function tabFill(tab_name, string) {
  const sublist = document.querySelector(`.sublist[data-item-name=${tab_name}]`);
  const tab_items = string.match(/\[.+?\]/g).map(item => item.slice(1,-1));
  
  let element;
  let params;

  for(let item of tab_items) {
    params = item.split(' ');
    element = createTabItem(params[0], params[1], params[2]);
    sublist.append(element);
  }
}

// function to change an item properties when an input take or lose checked state

function changeTabItemDecoration(input) {
  const item = input.closest('.sublist-item');
  const item_text = item.querySelector('.sublist-item__content span');
  if(chosen_tab !== 'Done') {
    item_text.classList.toggle('checked');
  }
}

// listener to the add handler to inputs change event

todo_body.addEventListener('change', (event) => {
  if(!event.target.classList.contains('sublist-item__checkbox')){
    return;
  }

  changeTabItemDecoration(event.target);
  
  const item = event.target.closest('.sublist-item');
  let item_clone;
  let input;
  let span;

  if(chosen_tab !== 'Done') {
    if(event.target.checked) {
      item_clone = item.cloneNode(true);
      input = item_clone.querySelector('.sublist-item__content input'); 
      span = item_clone.querySelector('.sublist-item__content span');
      input.checked = true;
      span.classList.add('checked');
      done_list.append(item_clone);
    } else {
      item_clone = findClone(item, 'Done');
      if(item_clone) item_clone.remove();
    }
  } else {
    if(item.dataset.itemName === 'Done') {
      item.remove();
    } else {
      item_clone = findClone(item, item.dataset.itemName);
      item.remove();
      if(item_clone) {
        input = item_clone.querySelector('.sublist-item__content input'); 
        span = item_clone.querySelector('.sublist-item__content span');
        input.checked = false;
        span.classList.remove('checked');
      }
    }
  }
});

// function to find the item clone in the DONE tab

function findClone(item, where) {
  const where_list = document.querySelector(`.sublist[data-item-name=${where}]`);
  const where_items = where_list.querySelectorAll('.sublist-item');
  const tab_name = item.dataset.itemName;
  const item_text = item.querySelector('.sublist-item__content span').textContent;

  let result;
  let where_item_tab_name;
  let where_item_text;

  for(let where_item of where_items) {
    where_item_tab_name = where_item.dataset.itemName;
    where_item_text = where_item.querySelector('.sublist-item__content span').textContent;

    if(tab_name === where_item_tab_name && item_text === where_item_text) {
      result = where_item;
      break;
    }
  }
  return result;
}