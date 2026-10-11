// Select elements
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');

// Notes array
let notes = [];

// Load notes from localStorage
function loadNotes() {
  const saved = localStorage.getItem('notes');
  if (saved) {
    notes = JSON.parse(saved);
  }
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Render notes
function render(filteredNotes = notes) {
  notesList.innerHTML = '';

  if (filteredNotes.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No notes match your search.';
    notesList.appendChild(li);
  } else {
    filteredNotes.forEach(note => {
      const li = document.createElement('li');
      li.classList.add('note-card', `category-${note.category}`);

      const text = document.createElement('h3');
      text.textContent = note.text;

      const categoryLabel = document.createElement('small');
      categoryLabel.textContent = `Category: ${note.category}`;

      const dateLabel = document.createElement('small');
      dateLabel.textContent = `Created: ${note.createdAt}`;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        deleteNote(note.id);
      });

      li.appendChild(text);
      li.appendChild(categoryLabel);
      li.appendChild(dateLabel);
      li.appendChild(deleteBtn);

      notesList.appendChild(li);
    });
  }

  updateCount();
}

// Update count message
function updateCount() {
  const count = notes.length;
  if (count === 0) {
    noteCount.textContent = 'You have no notes yet.';
  } else if (count === 1) {
    noteCount.textContent = 'You have 1 note.';
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Add note
function addNote(text, category) {
  const id = Date.now();
  const createdAt = new Date().toLocaleString();
  const note = { id, text, category, createdAt };
  notes.push(note);
  saveNotes();
  render();
}

// Delete note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render();
}

// Form submit
noteForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = noteInput.value.trim();
  const category = noteCategory.value;

  if (text.length === 0) {
    errorMessage.textContent = 'Please type a note first.';
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    return;
  }

  errorMessage.textContent = '';
  addNote(text, category);
  noteInput.value = '';
});

// Search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = notes.filter(note =>
    note.text.toLowerCase().includes(query)
  );
  render(filtered);
});

// Initialize
loadNotes();
render();
