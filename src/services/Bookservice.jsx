// src/services/BookService.js
import axios from "axios";

const API_URL = "http://localhost:8081/api/books";

export const getAllBooks = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const borrowBook = async (bookId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/borrow/${bookId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;
  }
};









