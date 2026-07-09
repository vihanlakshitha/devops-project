const API_BASE = 'http://localhost:3001';
const API_URL = `${API_BASE}/api/message`;
const NOTES_URL = `${API_BASE}/api/notes`;

async function fetchMessage(apiUrl) {
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data.message;
}

async function fetchNotes(notesUrl) {
  const res = await fetch(notesUrl);
  return res.json();
}

async function createNote(notesUrl, text) {
  const res = await fetch(notesUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error('Failed to create note');
  }
  return res.json();
}

if (typeof document !== 'undefined') {
  const messageEl = document.getElementById('message');
  const notesListEl = document.getElementById('notes-list');
  const noteFormEl = document.getElementById('note-form');
  const noteInputEl = document.getElementById('note-input');

  const loadMessage = async () => {
    try {
      messageEl.textContent = await fetchMessage(API_URL);
    } catch (err) {
      messageEl.textContent = 'Could not reach backend. Is it running?';
    }
  };

  const renderNotes = (notes) => {
    notesListEl.innerHTML = '';
    notes.forEach((note) => {
      const li = document.createElement('li');
      li.textContent = note.text;
      notesListEl.appendChild(li);
    });
  };

  const loadNotes = async () => {
    try {
      renderNotes(await fetchNotes(NOTES_URL));
    } catch (err) {
      notesListEl.innerHTML = '<li>Could not load notes.</li>';
    }
  };

  noteFormEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = noteInputEl.value.trim();
    if (!text) return;
    await createNote(NOTES_URL, text);
    noteInputEl.value = '';
    loadNotes();
  });

  document.getElementById('refresh').addEventListener('click', loadMessage);
  loadMessage();
  loadNotes();
}

if (typeof module !== 'undefined') {
  module.exports = { fetchMessage, fetchNotes, createNote };
}
