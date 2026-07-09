const API_URL = 'http://localhost:3001/api/message';
const messageEl = document.getElementById('message');

async function loadMessage() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    messageEl.textContent = data.message;
  } catch (err) {
    messageEl.textContent = 'Could not reach backend. Is it running?';
  }
}

document.getElementById('refresh').addEventListener('click', loadMessage);
loadMessage();
