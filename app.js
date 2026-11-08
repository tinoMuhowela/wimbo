// 1. Data and settings
const CLIENT_ID = "2e18b95f";
const API_URL =
  "https://api.jamendo.com/v3.0/tracks/?client_id=" + CLIENT_ID +
  "&format=json&limit=30&order=popularity_week&imagesize=300";

let songs = [];

// 2. Variables and page elements
const audio = new Audio();
let currentIndex = 0;

const songList = document.querySelector(".song-list");
const prevBtn = document.querySelector("#prev-btn");
const playBtn = document.querySelector("#play-btn");
const nextBtn = document.querySelector("#next-btn");
const volumeSlider = document.querySelector("#volume-slider");

// 3. Functions
async function loadSongs() {
  songList.innerHTML = "<p>Loading songs...</p>";

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    songs = data.results.map(function (track) {
      return {
        title: track.name,
        artist: track.artist_name,
        cover: track.image,
        src: track.audio
      };
    });

    renderSongs();
  } catch (error) {
    console.error(error);
    songList.innerHTML = "<p>Could not load songs. Check your internet.</p>";
  }
}

function renderSongs() {
  songList.innerHTML = "";

  songs.forEach(function (song, index) {
    const card = document.createElement("div");
    card.classList.add("song-card");

    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title} cover">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
    `;

    card.addEventListener("click", function () {
      playSong(index);
    });

    songList.appendChild(card);
  });
}

function playSong(index) {
  currentIndex = index;
  const song = songs[index];

  audio.src = song.src;
  audio.play();

  document.querySelector(".now-playing").textContent =
    song.title + " - " + song.artist;
}

function togglePlay() {
  if (audio.src === "") {
    playSong(0);
  } else if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function nextSong() {
  playSong((currentIndex + 1) % songs.length);
}

function prevSong() {
  playSong((currentIndex - 1 + songs.length) % songs.length);
}

// 4. Event listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

volumeSlider.addEventListener("input", function () {
  audio.volume = Number(volumeSlider.value);
});

audio.addEventListener("play", function () {
  playBtn.textContent = "Pause";
});

audio.addEventListener("pause", function () {
  playBtn.textContent = "Play";
});

audio.addEventListener("ended", nextSong);

// 5. Start
loadSongs();