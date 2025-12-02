// now_playing.js

let playableAlbums = [];
let currentIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  initNowPlaying();
});

async function initNowPlaying() {
  const button = document.getElementById("random-play");
  const embed = document.getElementById("now-playing-embed");

  console.log("button:", button);
  console.log("embed container:", embed);

  if (!button || !embed) {
    console.warn("Now Playing: button or embed container not found");
    return;
  }

  try {
    const res = await fetch("./record_details.json");
    console.log("fetch status:", res.status);
    const allDetails = await res.json();
    console.log("allDetails length:", allDetails.length);


    playableAlbums = allDetails.filter((rec) => rec.spotifyUrl);
    console.log("playableAlbums length:", playableAlbums.length);

    if (!playableAlbums.length) {
      embed.textContent =
        "no albums with previews yet — add spotifyUrl to record_details.json.";
      button.disabled = true;
      return;
    }

    button.addEventListener("click", () => {
      console.log("turntable clicked");
      spinDisc();
      playRandomAlbum();
    });
  } catch (err) {
    console.error("Error loading record_details.json for now playing:", err);
    embed.textContent = "sorry, something went wrong loading your records.";
  }
}

function playRandomAlbum() {
  if (!playableAlbums.length) {
    console.warn("playRandomAlbum called with no playableAlbums");
    return;
  }

  let nextIndex = Math.floor(Math.random() * playableAlbums.length);
  if (playableAlbums.length > 1 && nextIndex === currentIndex) {
    nextIndex = (nextIndex + 1) % playableAlbums.length;
  }
  currentIndex = nextIndex;

  const album = playableAlbums[currentIndex];
  const embedContainer = document.getElementById("now-playing-embed");

  console.log("chosen album:", album);

  const rawUrl = album.spotifyUrl;
  if (!rawUrl) {
    console.warn("chosen album has no spotifyUrl");
    return;
  }

  const embedUrl = rawUrl
    .replace("open.spotify.com/album", "open.spotify.com/embed/album")
    .split("?")[0];

  console.log("embedUrl:", embedUrl);


  embedContainer.innerHTML = `
    <iframe
      src="${embedUrl}"
      width="600"
      height="152"
      style="width: min(600, 100%);"
      frameborder="0"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      title="Spotify preview: ${album.title || ""}"
    ></iframe>
  `;
}

function spinDisc() {
  const disc = document.getElementById("record-overlay");
  if (!disc) {
    console.warn("record-overlay not found");
    return;
  }

  disc.classList.add("spinning");
  setTimeout(() => {
    disc.classList.remove("spinning");
  }, 3500);
}



