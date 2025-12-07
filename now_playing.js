let playableAlbums = [];
let currentIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  initNowPlaying();
});

async function initNowPlaying() {
  const button = document.getElementById("random-play");
  const embed = document.getElementById("now-playing-embed");

  if (!button || !embed) {
    return;
  }

  try {
    const res = await fetch("./record_details.json");
    const allDetails = await res.json();

    playableAlbums = allDetails.filter((rec) => rec.spotifyUrl);

    if (!playableAlbums.length) {
      embed.textContent =
        "no albums with previews yet — add spotifyUrl to record_details.json.";
      button.disabled = true;
      return;
    }

    button.addEventListener("click", () => {
      spinDisc();
      playRandomAlbum();
    });
  } catch (err) {
    embed.textContent = "sorry, something went wrong loading your records.";
  }
}

function playRandomAlbum() {
  if (!playableAlbums.length) {
    return;
  }

  let nextIndex = Math.floor(Math.random() * playableAlbums.length);
  if (playableAlbums.length > 1 && nextIndex === currentIndex) {
    nextIndex = (nextIndex + 1) % playableAlbums.length;
  }
  currentIndex = nextIndex;

  const album = playableAlbums[currentIndex];
  const embedContainer = document.getElementById("now-playing-embed");

  const rawUrl = album.spotifyUrl;
  if (!rawUrl) {
    return;
  }

  const embedUrl = rawUrl
    .replace("open.spotify.com/album", "open.spotify.com/embed/album")
    .split("?")[0];

  embedContainer.innerHTML = `
    <p style="position:absolute;left:-9999px;">
      30-second audio preview of ${album.title || "selected album"}
    </p>
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

  embedContainer.focus();
}

function spinDisc() {
  const disc = document.getElementById("record-overlay");
  if (!disc) {
    return;
  }

  disc.classList.add("spinning");
  setTimeout(() => {
    disc.classList.remove("spinning");
  }, 3500);
}




