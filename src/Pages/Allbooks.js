import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Allbooks.css";

function Allbooks() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(API_URL + "api/books/allbooks");
        setBooks(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooks();
  }, [API_URL]);

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>All Books</h1>
      </div>
     
      {books.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px", fontSize: "1.2rem", color: "#888" }}>
          No Books in Library
        </div>
      ) : (
        <table className="books-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Categories</th>
              <th>Copies Available</th>
              <th>Added Date</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, idx) => (
              <tr key={book._id || idx}>
                <td>{idx + 1}</td>
                <td>{book.bookName}</td>
                <td>{book.author}</td>
                <td>
                  {Array.isArray(book.categories)
                    ? book.categories.map((cat, i) =>
                        typeof cat === "string"
                          ? cat
                          : cat.categoryName
                      ).join(", ")
                    : ""}
                </td>
                <td>{book.bookCountAvailable}</td>
                <td>{book.createdAt ? book.createdAt.substring(0, 10) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Allbooks;