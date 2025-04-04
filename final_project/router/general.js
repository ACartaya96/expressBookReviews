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

// Simulating a promise function that fetches the books
let getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (books) {
            resolve(books);
        } else{
            reject(new Error("Books data not found"))
        }
    }, 3000)
})
  


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send response in a JSON format
    getBooks
        .then((bookList) => res.send(JSON.stringify(bookList,null,4)))
        .catch((err) => res.status(500).json(({ error: err.message })));      
});

// Changes this into a function to pass the req data to match book to isbn
function searchISBN(isbn){ 
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        if(isbn)
        {
            resolve(books[isbn]);
        } else {
            reject(new Error("Isbn not found"))
        }
    },3000)
})
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    searchISBN(isbn)
        .then((book) => res.send(book))
        .catch((err) => res.status(400).json(({error: err.message})));
    
 });


function getBooksByAuthor(author){
    return new Promise((resolve,reject) => {
    let results = [];
    setTimeout(() => {
            const keys = Object.keys(books);
            keys.forEach(key => {
            if(books[key].author === author){
                results.push(books[key])
            }
            })

            if (results.length > 0) {
                resolve(results); 
            } else {
                reject(new Error("No books found for this author"));
            }     
    },3000)
})
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;
    getBooksByAuthor(authorName)
        .then((bookList) => res.send(JSON.stringify(bookList,null,4)))
        .catch((err) => res.status(400).json(({error: err.message})));
});

// I am doing this for assignment it would be more efficien if I took
// getBooksByAuthor and make it a template function for general use
// renaming it getBooksBy
function getBooksByTitle(title){
    return new Promise((resolve,reject) => {
    let results = [];
    setTimeout(() => {
            const keys = Object.keys(books);
            keys.forEach(key => {
            if(books[key].title === title){
                results.push(books[key])
            }
            })

            if (results.length > 0) {
                resolve(results); 
            } else {
                reject(new Error("No books found with this title"));
            }     
    },3000)
})
}
  
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleName = req.params.title;
    getBooksByTitle(titleName)
        .then((bookList) => res.send(JSON.stringify(bookList,null,4)))
        .catch((err) => res.status(400).json(({error: err.message})));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get ISBN param data
    const isbn = req.params.isbn;

    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
