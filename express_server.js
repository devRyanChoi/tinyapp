const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080


app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const cookieSession = require('cookie-session');
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
); 

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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// get - URLS page
app.get("/urls", (req, res) => {
  console.log(req.session);
  const templateVars = { 
    user: users[req.session.user_id],
    urls: urlDatabase,
  }
  res.render("urls_index", templateVars)
});

// POST - URLS page
app.post("/urls", (req, res) => {

  let g = generateRandomString();
  console.log(req.body.longURL);
    
  urlDatabase[g] = {};
  urlDatabase[g].longURL = req.body.longURL;
  urlDatabase[g].userID = req.session.user_id;
  res.redirect(`/urls/${g}`);        
});


// GET - url/new
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    console.log("you are logged out, please login");
    res.redirect("/login");
  }
    
  let templateVars = {
    user: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_new", templateVars);
});

// GET - url/:shortURL
app.get("/urls/:shortURL", (req, res) => {
  
  let templateVars = {
    user : req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] 
  };
   
  res.render("urls_show", templateVars);
});

// POST - urls/:shortURL  - Edit the LongURL
app.post("/urls/:shortURL", (req, res) => {
  const updatedURL = req.params.shortURL;
  urlDatabase[updatedURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

// GET - u/:shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//POST - urls/:shortURL/delete -delete
app.post(("/urls/:shortURL/delete"), (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});


// LOGIN Page
app.get("/login", (req, res) => {
  const templateVars = {
    user: req.session["user_id"],
   
  };
  res.render("login", templateVars);
});

// login cookie
app.post(("/login"), (req, res) => {
  res.cookie('user_id', req.body.user_id);
  res.redirect("/urls");
});

// logOut cookie
app.post("/logout", (req, res) => {
    res.clearCookie("user_id");
    res.redirect("/urls");
  });


// Register   
app.get("/register", (req, res)=>{
  console.log("GET");
  res.render("urls_register", {user: null});
});


