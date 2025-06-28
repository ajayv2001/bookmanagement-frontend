import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../../services/api';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const booksPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await deleteBook(id);
      fetchAllBooks();
      toast.success('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    }
  };

  const sortBooks = (books) => {
    if (!sortKey) return books;

    return [...books].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'rating') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else {
        aVal = aVal?.toString().toLowerCase();
        bVal = bVal?.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedBooks = sortBooks(books);
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <div className="container my-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h3 className="fw-bold mb-2">Book List</h3>

        {/* Sort Dropdown */}
        <div className="dropdown mb-2">
          <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Sort Options
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={() => { setSortKey('title'); setSortOrder('asc'); }}>
                Alphabetical (A-Z)
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => { setSortKey('title'); setSortOrder('desc'); }}>
                Alphabetical (Z-A)
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => { setSortKey('rating'); setSortOrder('desc'); }}>
                Rating (High → Low)
              </button>
            </li>
          </ul>
        </div>
      </div>

      {books.length === 0 ? (
        <p className="text-center">No books available. Please add some.</p>
      ) : (
        <div className="card shadow-sm p-4 bg-light">
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead className="table-secondary">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book) => (
                  <tr key={book.id || book._id}>
                    <td
                      className="text-primary"
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => navigate(`/books/${book.id || book._id}`)}
                    >
                      {book.title}
                    </td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.rating}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(book.id || book._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination flex-wrap">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
