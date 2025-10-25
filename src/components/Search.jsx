
import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../components/header.jsx";
import '../App.css';

const BASE_URL = "http://localhost:8081";

const SearchBooks = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("keyword");
  const token = sessionStorage.getItem("token");

  // Fetch search results
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setMessage("");
      try {
        const response = await axios.get(
          `${BASE_URL}/api/books/search?keyword=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.data && response.data.data.length > 0) {
          setResults(response.data.data);
          setMessage("");
        } else {
          setResults([]);
          setMessage("No results found.");
        }
      } catch (error) {
        console.error(error);
        setResults([]);
        setMessage("An error occurred while searching.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, token]);

  // Handle Borrow functionality
  const handleBorrow = async (bookId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/books/borrow/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Book borrowed successfully!");

      // Refresh results after borrowing
      const updatedResults = results.map((book) =>
        book.id === bookId ? { ...book, borrowed: true, dueDate: response.data.dueDate } : book
      );
      setResults(updatedResults);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to borrow the book.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Header />
      <h5>Search results for: "{query}"</h5>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      )}

      {message && !loading && (
        <p style={{ textAlign: "center", color: "#555", marginTop: "10px" }}>
          {message}
        </p>
      )}

      {!loading && results.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
          {results.map((book) => (
            <div
              key={book.id}
              style={{
                width: "200px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
              }}
            >
              <img
                src={`${BASE_URL}${book.imagePath}`}
                alt={book.bookName}
                style={{ width: "100%", height: "250px", objectFit: "contain" }}
              />
              <h3>{book.bookName}</h3>
              <p>{book.authorName}</p>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>{book.description}</p>

              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={book.borrowed}
                onClick={() => handleBorrow(book.id)}
              >
                {book.borrowed ? "Borrowed" : "Borrow"}
              </Button>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBooks;
