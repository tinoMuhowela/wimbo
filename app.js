const songs = [
  {
    title: "Sunrise",
    artist: "Amani",
    cover: "https://picsum.photos/seed/sunrise/300",
    src: ""
  },
  {
    title: "Night Drive",
    artist: "Neo",
    cover: "https://picsum.photos/seed/nightdrive/300",
    src: ""
  },
  {
    title: "Ocean Waves",
    artist: "Zuri",
    cover: "https://picsum.photos/seed/ocean/300",
    src: ""
  },
  {
    title: "City Lights",
    artist: "Kito",
    cover: "https://picsum.photos/seed/city/300",
    src: ""
  }
];

const songList = document.querySelector(".song-list");

function renderSongs() {
  songList.innerHTML = "";

  songs.forEach(function (song) {
    const card = document.createElement("div");
    card.classList.add("song-card");

    card.innerHTML = `
      <img src="${song.cover}" alt="${song.title} cover">
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
    `;

    songList.appendChild(card);
  });
}

renderSongs();