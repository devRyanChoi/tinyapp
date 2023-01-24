
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


//generating random string to id
app.post("/urls", (req, res) => {

  let g = generateRandomString();
  console.log(req.body.longURL);
    
  urlDatabase[g] = {};
  urlDatabase[g].longURL = req.body.longURL;
  urlDatabase[a].userID = req.cookies.user_id;
  res.redirect(`/urls/${g}`);      
   
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies.username };
  
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    user : req.cookies.user_id,
    id: req.params.id, 
    longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// Edit the LongURL
app.post("/urls/:id", (req, res) => {
  const updatedURL = req.params.id;
  urlDatabase[updatedURL].longURL = req.body.newURL;
  res.redirect("/urls");
});

// Edit longURL
// app.post("/urls/:id", (req, res) => {
//   const longURL = urlDatabase[req.body];
//   res.redirect("/urls");
// });

//delete
app.post(("/urls/:id/delete"), (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls")
});


// LOGIN Page
app.post(("/login"), (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});

app.post("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/urls");
  });

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
