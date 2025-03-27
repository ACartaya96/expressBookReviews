const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password have been provided
    if(username && password)
    {
        // Check if user does not already exist
        if(!isValid(username)) {
            // Add the new user to the users array
            users.push({"username" : username, "password": password});
            return res.status(300).json({message: "User successfully registered. Now you can login."});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if user or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send response in a JSON format
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Get ISBN param data
    const isbn = req.params.isbn;

    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    const keys = Object.keys(books);

    keys.forEach(key => {
        if(books[key].author === authorName){
            res.send(books[key]);
        }
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    const keys = Object.keys(books);

    keys.forEach(key => {
        if(books[key].title === titleName){
            res.send(books[key]);
        }
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get ISBN param data
    const isbn = req.params.isbn;

    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
