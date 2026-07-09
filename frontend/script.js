const API_URL = 'http://localhost:3001/api/message';

async function fetchMessage(apiUrl) {
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data.message;
}

if (typeof document !== 'undefined') {
  const messageEl = document.getElementById('message');

  const loadMessage = async () => {
    try {
      messageEl.textContent = await fetchMessage(API_URL);
    } catch (err) {
      messageEl.textContent = 'Could not reach backend. Is it running?';
    }
  };

  document.getElementById('refresh').addEventListener('click', loadMessage);
  loadMessage();
}

if (typeof module !== 'undefined') {
  module.exports = { fetchMessage };
}
