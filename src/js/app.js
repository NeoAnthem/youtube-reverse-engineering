import { searchYouTube } from './api.js';

const input = document.getElementById('search-input');
const button = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');

const historyContainer = document.createElement('div');
historyContainer.style.marginTop = '20px';
historyContainer.style.paddingTop = '10px';
historyContainer.innerHTML = '<h3>Recent Searches</h3>';
document.body.appendChild(historyContainer);

button.addEventListener('click', () => {
  const query = input.value.trim();
  if (query) {
    runSearch(query);
  }
});

function saveSearchQuery(query) {
  let history = JSON.parse(localStorage.getItem('yt_search_history')) || [];
  history = history.filter(q => q !== query);
  history.unshift(query);
  if (history.length > 5) history.pop();
  localStorage.setItem('yt_search_history', JSON.stringify(history));
  renderSearchHistory();
}

function renderSearchHistory() {
  const history = JSON.parse(localStorage.getItem('yt_search_history')) || [];
  historyContainer.innerHTML = '<h3>Recent Searches</h3>';
  history.forEach(query => {
    const btn = document.createElement('button');
    btn.textContent = query;
    btn.style.margin = '5px';
    btn.style.padding = '5px 10px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      input.value = query;
      runSearch(query);
    });
    historyContainer.appendChild(btn);
  });
}

async function runSearch(query) {
  resultsContainer.innerHTML = '<p>Loading...</p>';
  saveSearchQuery(query);
  try {
    const data = await searchYouTube(query);
    resultsContainer.innerHTML = '';
    const items = data.items;



    items.forEach(video => {
  if (video.type === "video") {
    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const videoCard = document.createElement('div');
    videoCard.style.margin = '10px';
    videoCard.innerHTML = `
      <a href="${videoUrl}" target="_blank">
        <img src="${video.thumbnail.url}" alt="Thumbnail" width="300" />
        <p>${video.title}</p>
      </a>
    `;
    resultsContainer.appendChild(videoCard);
  }
    });
  } catch (error) {
    resultsContainer.innerHTML = `<p style="color:red;">Something went wrong. Try again later.</p>`;
    console.error("Search error:", error);
  }
}

renderSearchHistory();
