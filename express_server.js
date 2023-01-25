
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080


app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const templateVars = { 
    user: req.cookies.user_id,
    urls: urlDatabase, 
  };
  
  res.render("urls_index", templateVars)
});

//Creating a new longURL with random ShortURL id route
app.get("/urls/new", (req, res) => {
  const templateVars = {
  user: req.cookies.user_id,
  shortURL: req.params.shortURL,
  longURL: urlDatabase[req.params.shortURL] };
res.render("urls_new", templateVars);
});

app.post("/urls/new", (req, res) => {
  let newURLId = generateRandomString();
  urlDatabase[newURLId] = {
    longURL: req.body.longURL,
    user_id: req.cookies.user_id 
  }
res.redirect("/urls", newURLId);
});





//generating random string to id
app.post("/urls", (req, res) => {

  let g = generateRandomString();
  console.log(req.body.longURL);
    
  urlDatabase[g] = {};
  urlDatabase[g].longURL = req.body.longURL;
  urlDatabase[a].userID = req.cookies.user_id;
  res.redirect(`/urls/${g}`);      
   
});

//Editing longURL page
app.get("/urls/:shortURL", (req, res)=>{
  const templateVars = { 
    user : req.cookies.user_id,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

// Edit the LongURL
app.post("/urls/:shortURL", (req, res) =>{
  const updatedURL = req.params.shortURL;
  urlDatabase[updatedURL] = req.body.longURL;
  res.redirect("/urls");  
});

//shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  
  res.redirect('http://' + longURL);
});


//delete
app.post(("/urls/:shortURL/delete"), (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});


// LOGIN Page
app.post(("/login"), (req, res) => {
  res.cookie('user_id', req.body.user_id);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user_id: req.cookies["user_id"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});

// LOGOUT Page
app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
  });

// Register
app.get("/register" , (req, res) => {
  console.log("GET");
  res.render("urls_register");
});

app.post("/register", (req, res)=> {
  let getID = req.body.id;
  let getEmail = req.body.email;
  let getPassword = req.body.password;

  let randomID = generateRandomString();

  users[randomID] = {id: randomId, email: getEmail, password: getPassword };
  
  res.redirect("/urls");
});
