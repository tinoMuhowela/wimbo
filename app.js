const songs = [
  {
    title: "Night Drive",
    artist: "Neo",
    cover: "https://picsum.photos/seed/nightdrive/300",
    src: "music/NightDrive.mp3"
  },
  {
    title: "Ocean Waves",
    artist: "Zuri",
    cover: "https://picsum.photos/seed/ocean/300",
    src: "music/OceanWaves.mp3"
  },
  {
    title: "Everyday Is A Holiday",
    artist: "Brotheration Records",
    cover: "https://picsum.photos/seed/holiday/300",
    src: "music/sunrise.mp3"
  }
];

const audio = new Audio();
let currentIndex = 0;

const songList = document.querySelector(".song-list");
const prevBtn = document.querySelector("#prev-btn");
const playBtn = document.querySelector("#play-btn");
const nextBtn = document.querySelector("#next-btn");
const volumeSlider = document.querySelector("#volume-slider");

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
        console.log("You clicked card number", index);
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

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);


audio.addEventListener("play", function () {
  playBtn.textContent = "Pause";
});

audio.addEventListener("pause", function () {
  playBtn.textContent = "Play";
});

audio.addEventListener("ended", nextSong);

volumeSlider.addEventListener("input", function () {
  audio.volume = Number(volumeSlider.value);
});


renderSongs();