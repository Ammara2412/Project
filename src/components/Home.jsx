import React, { useEffect, useState } from "react";
import { getAllBooks, borrowBook } from "../services/BookService";
import Header from "../components/header.jsx";
import { Box,Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import '../App.css';

const BASE_URL = "http://localhost:8081";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks(token);
        setBooks(data);
      } catch (error) {
        console.error(error);
        setMessage("unable to fetch books.");
        setSeverity("error");
        setOpen(true);
      }
    };
     fetchBooks();
  }, [token]);

  const handleBorrow = async (bookId) => {
     if (!token) {
      // if not logged in, redirect to login
      navigate("/login");
      return;
    }
    try {
      // Call backend to borrow book
      const response = await borrowBook(bookId, token);
      // Show feedback
      setMessage(
        response.message || response?.data?.message || 
        "Book borrowed successfully! Check your email."
      );
      setSeverity("success");
      setOpen(true);

      // Refresh book list to update "borrowed" status
      const updatedBooks = await getAllBooks(token);
      setBooks(updatedBooks);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to borrow the book."
      );
      setSeverity("error");
      setOpen(true);
    }
  };

  // Group books by genre
  const booksByGenre = books.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" , minHeight: "100vh", // <-- ensures it covers full viewport
      boxSizing: "border-box",}}>
      <Header />
       <Box mt={0}> {/* Add margin-top */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <tbody>
          {Object.keys(booksByGenre).map((genre) => (
            <React.Fragment key={genre}>
              <tr>
                <td
                  colSpan={1}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    backgroundColor: "CBAACB",
                    fontWeight: "bold",
                  }}
                >
                  {genre} Books
                </td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px",
                    }}
                  >
                    {booksByGenre[genre].map((book) => (
                      <div
                        key={book.id}
                        style={{
                          width: "200px",
                         
                          borderRadius: "0px",
                          padding: "10px",
                          textAlign: "center",
                          backgroundColor: "CBAACB",
                        }}
                      >
                        <img
                          src={`${BASE_URL}${book.imagePath}`}
                          alt={book.bookName}
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "contain",
                          }}
                        />
                        <h3>{book.bookName}</h3>
                        <p>{book.authorName}</p>
                        <p style={{ fontSize: "0.9rem", color: "#555" }}>
                          {book.description}
                        </p>
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
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      </Box>
    </div>
  );
};

export default Home;




