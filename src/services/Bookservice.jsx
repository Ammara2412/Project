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









/*Succesfully Running

import axios from "axios";

const BASE_URL = "http://localhost:8081/api/books";

// Get all books
export const getAllBooks = async (token) => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Authentication failed");
    }
    throw error;
  }
};

// Borrow a book
export const borrowBook = async (bookId, userId, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/borrow/${bookId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};













import axios from "axios";
const BASE_URL = "http://localhost:8081/api/books";

// Fetch all books
const getAllBooks = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // should be an array of books
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Borrow a book
const borrowBook = async (bookId, token, userEmail) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/borrow/${bookId}`,
      { email: userEmail },
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

export default { getAllBooks, borrowBook };*/

