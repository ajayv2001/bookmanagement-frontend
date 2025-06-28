import React, { useState } from 'react';
import { createBook } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddBooks() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    publicationDate: '',
    isbn: '',
    genre: '',
    rating: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!book.title || book.title.length > 100) newErrors.title = 'Title is required (max 100 chars)';
    if (!book.author || book.author.length > 50) newErrors.author = 'Author is required (max 50 chars)';
    if (!book.publicationDate) newErrors.publicationDate = 'Date is required';
    if (!book.isbn || !/^\d{13}$/.test(book.isbn)) newErrors.isbn = 'ISBN must be exactly 13 digits';
    if (!book.genre) newErrors.genre = 'Genre is required';
    if (!book.rating || book.rating < 1 || book.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await createBook(book);
        toast.success('Book added successfully!');
        setBook({
          title: '',
          author: '',
          publicationDate: '',
          isbn: '',
          genre: '',
          rating: ''
        });
      } catch (error) {
        console.error('Error creating book:', error);
        toast.error('Failed to add book. Try again.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3 className="mb-4 fw-bold">Add New Book</h3>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            maxLength={100}
            value={book.title}
            onChange={handleChange}
            required
          />
          {errors.title && <small className="text-danger">{errors.title}</small>}
        </div>

        {/* Author */}
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            name="author"
            className="form-control"
            maxLength={50}
            value={book.author}
            onChange={handleChange}
            required
          />
          {errors.author && <small className="text-danger">{errors.author}</small>}
        </div>

        {/* Publication Date */}
        <div className="mb-3">
          <label className="form-label">Publication Date</label>
          <input
            type="date"
            name="publicationDate"
            className="form-control"
            value={book.publicationDate}
            onChange={handleChange}
            required
          />
          {errors.publicationDate && <small className="text-danger">{errors.publicationDate}</small>}
        </div>

        {/* ISBN */}
        <div className="mb-3">
          <label className="form-label">ISBN (13 digits)</label>
          <input
            type="text"
            name="isbn"
            className="form-control"
            pattern="\d{13}"
            value={book.isbn}
            onChange={handleChange}
            required
          />
          {errors.isbn && <small className="text-danger">{errors.isbn}</small>}
        </div>

        {/* Genre */}
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <select
            name="genre"
            className="form-select"
            value={book.genre}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Genre --</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Others">Others</option>
          </select>
          {errors.genre && <small className="text-danger">{errors.genre}</small>}
        </div>

        {/* Rating */}
        <div className="mb-3">
          <label className="form-label">Rating (1 to 5)</label>
          <input
            type="number"
            name="rating"
            className="form-control"
            min="1"
            max="5"
            value={book.rating}
            onChange={handleChange}
            required
          />
          {errors.rating && <small className="text-danger">{errors.rating}</small>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Add Book
        </button>
      </form>
    </div>
  );
}

export default AddBooks;
