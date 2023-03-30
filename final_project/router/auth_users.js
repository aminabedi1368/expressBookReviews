const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const JWT_SECRET = "fingerprint_customer";

const isValid = (username)=>{ //returns boolean

    let validation = users.filter((user)=>{
        console.log(user);
      return user.username === username
    });
    if(validation.length > 0){
      return false;
    } else {
      return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean

    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({message: "Error"});
    } else if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, JWT_SECRET , { expiresIn: "1d" });
  
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).json(req.session.authorization);
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.body.review;
    const user = req.user.data;
  
    const book = books[isbn];
  
    if (book) {        
        book.reviews[user] = review;
        return res.status(200).json(book);
    }
    else{
        return res.status(404).json({ message: "Invalid ISBN" });
    }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  
    const isbn = req.params.isbn;
    const user = req.user.data;
    const book = books[isbn];

      if (book) {
          delete book.reviews[user];
          return res.status(200).json(book);
      }else{
        return res.status(404).json({ message: "Invalid ISBN" });
      }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
