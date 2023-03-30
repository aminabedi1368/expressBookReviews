const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User registered."});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

const booksJson = await books;
  return new Promise((resolve, reject) => {
    resolve(res.status(200).json(booksJson));
  });
 
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    
    const ISBN = req.params.isbn;
    const book = await books[ISBN];
    if (book) {
        return new Promise((resolve, reject) => {
            resolve(res.status(200).json(book));
          });
      } else {
        res.status(404).json({ error: "Book not found" });
      }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;
  const bookArr = await Object.values(books);

  const book = bookArr.filter((book) => book.author === author);
  if (book.length>0) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: "Author not found" });
  }

});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
    const bookArray = await Object.values(books);
  
    const book = bookArray.filter((book) => book.title === title);
    if (book.length>0) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: "Title not found" });
    }
  });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN];
  
    if (book) {
      res.status(200).json(book.reviews);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  
});

module.exports.general = public_users;
