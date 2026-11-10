// 1. Data and settings
const CLIENT_ID = "2e18b95f";
const BASE_URL =
  "https://api.jamendo.com/v3.0/tracks/?client_id=" + CLIENT_ID +
  "&format=json&limit=30&imagesize=300";

let songs = [];

// 2. Variables and page elements
const audio = new Audio();
let currentIndex = 0;
let failCount = 0;

const songList = document.querySelector(".song-list");
const prevBtn = document.querySelector("#prev-btn");
const playBtn = document.querySelector("#play-btn");
const nextBtn = document.querySelector("#next-btn");
const volumeSlider = document.querySelector("#volume-slider");
const searchInput = document.querySelector("#search-input");
const homeLink = document.querySelector("#home-link");
const likedLink = document.querySelector("#liked-link");
const progressBar = document.querySelector("#progress-bar");
const currentTimeEl = document.querySelector("#current-time");
const durationEl = document.querySelector("#duration");
const nowPlaying = document.querySelector(".now-playing");

// 3. Functions
async function loadSongs(extra) {
  songList.innerHTML = "<p>Loading songs...</p>";

  try {
    const response = await fetch(BASE_URL + extra);
    const data = await response.json();

    songs = data.results.map(function (track) {
     return {
  id: track.id,
  title: track.name,
  artist: track.artist_name,
  cover: track.image,
  src: track.audio
};
    });

    if (songs.length === 0) {
      songList.innerHTML = "<p>No songs found. Try another word.</p>";
      return;
    }

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
  <button class="like-btn">${isLiked(song) ? "♥" : "♡"}</button>
`;


    card.addEventListener("click", function () {
      playSong(index);
    });

    const likeBtn = card.querySelector(".like-btn");

likeBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  toggleLike(song);
  likeBtn.textContent = isLiked(song) ? "♥" : "♡";
});


    songList.appendChild(card);
  });
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function playSong(index) {
  currentIndex = index;
  const song = songs[index];

  audio.src = song.src;

  audio.play().catch(function (error) {
    console.error("play() failed:", error);
  });

  nowPlaying.textContent = song.title + " - " + song.artist;
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

function getLiked() {
  const saved = localStorage.getItem("wimbo-liked");
  return saved ? JSON.parse(saved) : [];
}

function saveLiked(list) {
  localStorage.setItem("wimbo-liked", JSON.stringify(list));
}

function isLiked(song) {
  return getLiked().some(function (s) {
    return s.id === song.id;
  });
}

function toggleLike(song) {
  let liked = getLiked();

  if (isLiked(song)) {
    liked = liked.filter(function (s) {
      return s.id !== song.id;
    });
  } else {
    liked.push(song);
  }

  saveLiked(liked);
}

function showLiked() {
  songs = getLiked();

  if (songs.length === 0) {
    songList.innerHTML = "<p>No liked songs yet. Tap the heart on a song.</p>";
    return;
  }

 


  renderSongs();
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

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const query = searchInput.value.trim();

    if (query === "") {
      loadSongs("&order=popularity_week");
    } else {
      loadSongs("&search=" + encodeURIComponent(query));
    }
  }
});

homeLink.addEventListener("click", function (event) {
  event.preventDefault();
  searchInput.value = "";
  loadSongs("&order=popularity_week");
});

likedLink.addEventListener("click", function (event) {
  event.preventDefault();
  searchInput.value = "";
  showLiked();
});

audio.addEventListener("timeupdate", function () {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", function () {
  durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("input", function () {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

audio.addEventListener("error", function () {
  failCount++;

  if (failCount >= songs.length) {
    nowPlaying.textContent = "No songs could be played. Check your internet.";
    failCount = 0;
    return;
  }

  nowPlaying.textContent = "This song could not be played. Skipping...";
  setTimeout(nextSong, 1500);
});

audio.addEventListener("playing", function () {
  failCount = 0;
});



// 5. Start
loadSongs("&order=popularity_week");