const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userwithname = users.filter((user) => {
        return user.username === username;
    });

    if(userwithname.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if(!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    // Authenticate user
    if(authenticatedUser(username,password)){
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User successfully logged in");

    } else {
        return res.status(308).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {   
   const isbn = req.params.isbn;
   const reviewer = req.session.authorization.username;
   let review = req.body.review;

   if(!reviewer || !review) {
        return res.status(401).json({error: "Review or Reveiwer missing."})
   }

   // Check if the book exists
   if(!books[isbn]) {
        return res.status(404).json({error: "Book not found."})
   }

     // Add or update the review
     books[isbn].reviews[reviewer] = review;

     res.json({
         message: books[isbn].reviews[reviewer] ? "Review updated successfully!" : "Review added successfully!",
         reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewer = req.session.authorization.username;

    if(books[isbn].reviews[reviewer])
    {
        delete books[isbn].reviews[reviewer];
    }

    res.json({ message: "Review deleted successfully!", reviews: books[isbn].reviews }); 
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
