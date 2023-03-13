var audio = document.getElementById('audio');
var progressBar = document.querySelector('.player__progress');
var currentTime = document.querySelector('.player__time');
const playPauseButton = document.querySelector('.player__button');

function playPause() {
  if (audio.paused) {
    audio.play();
    playPauseButton.textContent = 'II';
  } else {
    audio.pause();
    playPauseButton.textContent = '▶';
  }
}

audio.addEventListener('timeupdate', function() {
  var duration = audio.duration;
  var currentTimeValue = audio.currentTime;
  var percentage = (currentTimeValue / duration) * 100;
  progressBar.style.width = percentage + '%';

  var minutes = Math.floor(currentTimeValue / 60);
  var seconds = Math.floor(currentTimeValue - minutes * 60);
  currentTime.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
});

audio.addEventListener('ended', function() {
  playPauseButton.textContent = '⟳'; // или другую иконку, которую вы хотите использовать
});

function updateTime(e) {
  const percent = (e.offsetX / this.offsetWidth);
  audio.currentTime = percent * audio.duration;
  progressBar.style.width = percent * 100 + '%';
}

let isPlaying = false;

const progressContainer = document.querySelector('.player__progress-bar');
progressContainer.addEventListener('click', updateTime);