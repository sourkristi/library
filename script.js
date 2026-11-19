const myLibrary = [];
const dialog = document.getElementById('book-dialog');
const form = document.getElementById('book-form');

document.getElementById('add-book').onclick = () => dialog.showModal();

function deleteBook(event) {
  const card = event.target.closest(".book-card");
  const bookId = card?.dataset.id;
  if (!bookId) return;

  const index = myLibrary.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    displayBooks(myLibrary);
  }
}

const deleteDialog = document.getElementById("delete-dialog");
const deleteForm = document.getElementById("delete-form");
const deleteMessage = document.getElementById("delete-message");
const cancelDeleteBtn = document.getElementById("cancel-delete");

let pendingDeleteId = null;

function openDeleteDialog(event) {
  const card = event.target.closest(".book-card");
  const bookId = card?.dataset.id;
  if (!bookId) return;

  const book = myLibrary.find((b) => b.id === bookId);
  pendingDeleteId = bookId;
  deleteMessage.textContent = book
    ? `Delete "${book.title}"?`
    : "Delete this book?";

  deleteDialog.showModal();
}

function confirmDeleteBook(event) {
  event.preventDefault();
  if (!pendingDeleteId) return;

  const index = myLibrary.findIndex((book) => book.id === pendingDeleteId);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    displayBooks(myLibrary);
  }

  pendingDeleteId = null;
  deleteDialog.close();
}

cancelDeleteBtn.addEventListener("click", () => {
  pendingDeleteId = null;
  deleteDialog.close();
});

deleteForm.addEventListener("submit", confirmDeleteBook);

function handleFormSubmit(event) {
  event.preventDefault();

  const title = form.elements.title.value;
  const author = form.elements.author.value;
  const pages = Number(form.elements.pages.value);
  const isRead = form.elements.isRead.checked;

  addBookToLibrary(title, author, pages, isRead);
  displayBooks(myLibrary);

  form.reset();
  dialog.close();
}

form.addEventListener("submit", handleFormSubmit, false);

function Book(title, author, pages, isRead) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBookToLibrary(title, author, pages, isRead) {
  const newBook = new Book(title, author, pages, isRead);
  myLibrary.push(newBook);
}

function displayBooks(books) {
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.dataset.id = book.id;

    bookCard.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <button type="button" class="toggle-read-btn">
        ${book.isRead ? "To be read" : "Read"}
      </button>
      <button type="button" class="delete-btn">Delete</button>
    `;

    container.appendChild(bookCard);
  });
}

document.getElementById("book-container").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    openDeleteDialog(event);
  }
});

function toggleReadStatus(event) {
  const card = event.target.closest(".book-card");
  const bookId = card?.dataset.id;
  if (!bookId) return;

  const book = myLibrary.find((b) => b.id === bookId);
  if (!book) return;

  book.isRead = !book.isRead;
  displayBooks(myLibrary);
}

document.getElementById("book-container").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    openDeleteDialog(event);
  } else if (event.target.classList.contains("toggle-read-btn")) {
    toggleReadStatus(event);
  }
});

addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, true);
addBookToLibrary("1984", "George Orwell", 328, true);
addBookToLibrary("Dune", "Frank Herbert", 412, false);
addBookToLibrary("Project Hail Mary", "Andy Weir", 496, false);
addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, true);

displayBooks(myLibrary);
console.log(myLibrary);