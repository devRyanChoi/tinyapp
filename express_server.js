const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080
const { 
  getUserByEmail,
  fetchUserInfo,
  generateRandomString,
} = require('./helpers')

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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
const users = {
  // userRandomID: {
  //   id: "userRandomID",
  //   email: "user@example.com",
  //   password: "purple-monkey-dinosaur",
  // },
  // user2RandomID: {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk",
  // },
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

// get - /urls
app.get("/urls", (req, res) => {
  
  if (!req.session.user_id) {
    console.log("Warning! Invalid user came!");
    res.redirect("/login");
  } else {
    const templateVars = { 
      user: users[req.session.user_id],
      urls: urlDatabase,
    }
    res.render("urls_index", templateVars)
  }
  
});

// POST - /urls
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
    console.log("Warning! Invalid user came!");
    res.redirect("/login");
  } else {
    let templateVars = {
      user: req.session.user_id,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_new", templateVars);
  }
    
  
});

// GET - url/:shortURL
app.get("/urls/:shortURL", (req, res) => {
  
  let templateVars = {
    user : req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL, 
  };
   
  res.render("urls_show", templateVars);
});

// POST - urls/:shortURL  - Edit the LongURL
app.post("/urls/:shortURL", (req, res) => {
  const updatedURL = req.params.shortURL;
  urlDatabase[updatedURL].longURL = req.body.longURL;
  res.redirect("/urls");
});


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if(!urlDatabase[shortURL]) {
    return res.redirect("/login");
  } else {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  }
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

// POST - login cookie
app.post("/login", (req, res) => {
  const emailUsed = req.body['email'];
  const pwdUsed = req.body['password'];
  if (!emailUsed || !pwdUsed) {
    res.status(403).send('Incorrect account, please try again');
  }  

  if (fetchUserInfo(emailUsed, users)) {
    const { password, id } = fetchUserInfo(emailUsed, users);

    if (bcrypt.compareSync(pwdUsed, password)) {
      req.session.user_id = id;
      res.redirect("/urls");
    } 
  } else {
      res.status(403).send('Incorrect account, please try again');
    }
});

// logOut cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


// GET - Register   
app.get("/register", (req, res)=>{
  console.log("A client came to register!");
  res.render("register", {user: null});
});

// POST - Register   
app.post("/register", (req, res)=>{
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("error");
    return res.status(400).send("Error");
  }

  if (getUserByEmail(email)) {return res.status(400).send("Email already exists")}

    const ID = generateRandomString();
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[ID] = {
      id: ID,
      email: req.body.email,
      password: hashedPassword
    }

  req.session.user_id = ID;
  res.redirect("/urls");
});
