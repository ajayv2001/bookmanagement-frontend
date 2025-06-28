import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bookmanagement-backend-5.onrender.com/api', 
});

// Add Book
export const createBook = (bookData) => API.post('/books', bookData);
// Get all books
export const getBooks = () => API.get('/books');

// Delete book by ID
export const deleteBook = (id) => API.delete(`/books/${id}`);

// Get single book
export const getBookById = (id) => API.get(`/books/${id}`);

// Get Google Books data via proxy
export const getGoogleBookByIsbn = (isbn) => API.get(`/books/external/google-books/${isbn}`);




