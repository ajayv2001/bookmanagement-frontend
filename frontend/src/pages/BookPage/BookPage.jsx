import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getBookById, getGoogleBookByIsbn } from '../../services/api';

export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [googleInfo, setGoogleInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const res = await getBookById(id);
      setBook(res.data);
      fetchGoogleInfo(res.data.isbn);
    } catch (err) {
      console.error('Error fetching book:', err);
    }
  };

  const fetchGoogleInfo = async (isbn) => {
    try {
      const res = await getGoogleBookByIsbn(isbn);
      if (res.data && !res.data.error) {
        setGoogleInfo(res.data);
      } else {
        setGoogleInfo(null);
      }
    } catch (err) {
      console.error('Error fetching Google book info:', err);
      setGoogleInfo(null);
    }
  };

  if (!book) return <div className="text-center py-5">Loading book details...</div>;

  return (
    <div className="container my-4">
      <div className="card shadow p-4 bg-light">
        <h3 className="mb-4 fw-bold text-center">{book.title}</h3>

        {/* Tabs */}
        <ul className="nav nav-tabs justify-content-center mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'more' ? 'active' : ''}`}
              onClick={() => setActiveTab('more')}
            >
              More Details
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'basic' && (
          <div className="row">
            <div className="col-md-6">
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Publication Date:</strong> {book.publicationDate}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Rating:</strong> {book.rating}</p>
            </div>
          </div>
        )}

        {activeTab === 'more' && (
          <div className="row">
            {googleInfo ? (
              <>
                {googleInfo.thumbnail && (
                  <div className="col-md-4 text-center mb-3">
                    <img
                      src={googleInfo.thumbnail}
                      alt="Book Cover"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}

                <div className="col-md-8">
                  <p><strong>Title from Google:</strong> {googleInfo.title}</p>
                  <p><strong>Authors:</strong> {googleInfo.authors?.join(', ')}</p>
                  <p><strong>Description:</strong> {googleInfo.description || "No description available."}</p>
                </div>
              </>
            ) : (
              <div className="col-12">
                <p>No additional information found for this ISBN.</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-4">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
            ← Back to Book List
          </button>
        </div>
      </div>
    </div>
  );
}
