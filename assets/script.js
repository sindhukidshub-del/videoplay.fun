// Load videos dynamically
fetch("videos.json")
  .then(res => res.json())
  .then(videos => {
    const list = document.getElementById("video-list");
    videos.forEach(video => {
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <h3>${video.title}</h3>
      `;
      card.onclick = () => {
        window.location.href = `video.html?url=${encodeURIComponent(video.url)}`;
      };
      list.appendChild(card);
    });
  });
