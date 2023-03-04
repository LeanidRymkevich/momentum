import playList from "./playList.js";

const play_icon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<title>play2</title>
<path fill="#fff" d="M32 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 58c-14.359 0-26-11.641-26-26s11.641-26 26-26 26 11.641 26 26-11.641 26-26 26zM24 18l24 14-24 14z"></path>
</svg>`;

const pause_icon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<title>pause</title>
<path fill="#fff" d="M32 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 58c-14.359 0-26-11.641-26-26s11.641-26 26-26 26 11.641 26 26-11.641 26-26 26zM20 20h8v24h-8zM36 20h8v24h-8z"></path>
</svg>`;

const playList_container = document.querySelector('.play-list');
const play_button = document.querySelector('.play');
const play_prev_button = document.querySelector('.play-prev');
const play_next_button = document.querySelector('.play-next');
const track_name = document.querySelector('.track-name');
const volume_control = document.querySelector('.volume-control');
const volume_button = document.querySelector('.volume-button');
const progress = document.querySelector('.progress');
const timer = document.querySelector('.timer');
const audio = new Audio();


let current_track_index = 0;
let isPlay = false;
let current_volume_level = 0.7;
let timerId;
let current_progress;
let track_timer;

track_name.textContent = `${current_track_index + 1}. ${playList[current_track_index].title}`;

// function for playlist filling

function createPlayListItem(text, playList_container) {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.innerHTML = play_icon + text;
  playList_container.append(li);
}

// filling the playlist

playList.forEach(item => createPlayListItem(item.title, playList_container));

function playAudio(audio, playlist_index) {
  const current_list_item =  document.querySelectorAll('.play-list li')[current_track_index];
  // audio.src = playList[playlist_index].src;
  
  if(audio.src !== playList[playlist_index].src){
    audio.src = playList[playlist_index].src;
    track_timer = 0;
  }

  if(!isPlay) {
    audio.currentTime = track_timer || 0;
    play_button.classList.add('pause');
    current_list_item.innerHTML = pause_icon + playList[current_track_index].title;
    current_list_item.classList.add('play-item_active');
    track_name.textContent = `${current_track_index + 1}. ${playList[current_track_index].title}`;
    isPlay = true;
    audio.play();
    } else {
    track_timer = audio.currentTime;
    current_list_item.innerHTML = play_icon + playList[current_track_index].title;
    current_list_item.classList.remove('play-item_active');
    play_button.classList.remove('pause');
    isPlay = false;
    audio.pause();
  }
}

// function for getting play list item index to loop music play

function getNextOrPrevIndex(playList, index) {
  if(index >= 0 && index < playList.length){
    return index;
  } else if(index < 0){
    return playList.length - 1;
  } else {
    return 0;
  }
}

// adding listener for loop music play

audio.addEventListener('ended', () =>{
  playAudio(audio, current_track_index);
  const next_index = getNextOrPrevIndex(playList, current_track_index + 1);
  current_track_index = next_index;
  playAudio(audio, current_track_index);
});

// listener for the play button

play_button.addEventListener('click', () => {
  playAudio(audio, current_track_index);
  // if(current_track_index !== 0 && !isPlay){
  //   current_track_index = 0;
  // }
  /*
    or it is possible to re-comment the if-block
    in order to play music from the first track
  */
});

// listener for the play-next button

play_next_button.addEventListener('click', () => {
  const next_index = getNextOrPrevIndex(playList, current_track_index + 1);
  if(isPlay){
    playAudio(audio, current_track_index);
    current_track_index = next_index;
    playAudio(audio,current_track_index);
  } else {
    current_track_index = next_index;
    playAudio(audio,current_track_index);
  }
});

// listener for the play-prev button

play_prev_button.addEventListener('click', () => {
  const prev_index = getNextOrPrevIndex(playList, current_track_index - 1);
  if(isPlay){
    playAudio(audio, current_track_index);
    current_track_index = prev_index;
    playAudio(audio,current_track_index);
  } else {
    current_track_index = prev_index;
    playAudio(audio,current_track_index);
  }
});

// listener for volume change

volume_control.addEventListener('change', () => {
  audio.volume = volume_control.value / volume_control.max;
  current_volume_level = volume_control.value / volume_control.max;
  if(audio.volume === 0) {
    volume_button.classList.add('volume-button_off');
  } else {
    volume_button.classList.remove('volume-button_off');
  }
});

// listener for sound muting

volume_button.addEventListener('click', () => {
  if(audio.volume !== 0) {
    volume_button.classList.add('volume-button_off');
    volume_control.value = 0;
    audio.volume = 0;
  } else {
    audio.volume = current_volume_level;
    volume_control.value = current_volume_level * volume_control.max;
    volume_button.classList.remove('volume-button_off');
  }
});

// listener for progress-bar updating  and timer starting

audio.addEventListener('playing', () => {
  timerId = setInterval(() => {
    timer.textContent = `${secToMin(Math.floor(audio.currentTime))} / ${secToMin(Math.floor(audio.duration))}`;
    current_progress = (audio.currentTime / audio.duration) * progress.max;
    progress.value = current_progress;
  }, 50)
}); 

// listener for timer ending

audio.addEventListener('ended', () => {
  clearInterval(timerId);
}); 

// listener for music playing progress change

progress.addEventListener('change', () =>{
  // audio.pause;
  // audio.currentTime = (progress.value / progress.max) * audio.duration;
  // audio.play;
  if(isPlay){
    playAudio(audio, current_track_index);
    track_timer = (progress.value / progress.max) * audio.duration;
    playAudio(audio, current_track_index);
  } else {
    track_timer = (progress.value / progress.max) * audio.duration;
    audio.currentTime = track_timer;
  }
});

// seconds to min:sec format function

function secToMin(seconds_num) {
  const minutes = Math.floor(seconds_num / 60);
  const seconds = seconds_num - minutes * 60;

  return `${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
}

// listener to play list-item by clicking on it

playList_container.addEventListener('click', (event) => {
  if(!event.target.closest('.play-list svg')){
    return;
  }
  const target = event.target.closest('.play-list li');
  
  const index = playList.findIndex(item => item.title === target.innerText);
  if(isPlay){
    playAudio(audio, current_track_index);
    if(current_track_index !== index) {
      current_track_index = index;
      playAudio(audio, current_track_index);
    }
  } else {
    current_track_index = index;
    playAudio(audio, current_track_index);
  }
});