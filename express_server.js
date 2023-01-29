const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080
const { 
  getUserByEmail,
  fetchUserInfo,
  generateRandomString,
} = require('./helpers')

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

const getUserByID = (userID, users) => {
  for (let user in users) {
    if (users[user].id === userID) {
      return users[user];
    }
  }
  return false;
};

const urlsForUser = function(userId) {
  const urls = {};
  const keys = Object.keys(urlDatabase);
  for (const id of keys) {
    const url = urlDatabase[id];
    if (url.userID === userId) {
      urls[id] = url;
    }
  }
  return urls;
};


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// entry point for a website
app.get("/", (req, res) => {
  res.redirect("/login");
});

// get - /urls
app.get("/urls", (req, res) => {
  const userCookieID = req.session.user_id;
  const user = getUserByID(userCookieID, users);
  if (!user) { return res.send('You must login first! Please <a href="/login">Try again</a>') }
  const urls = urlsForUser(userCookieID);
  const templateVars = { 
    url: urls, 
    user_id: user.id, 
    user_email: user.email };
  res.render("urls_index", templateVars);
});

 

// POST - /urls
app.post("/urls", (req, res) => {
  const userCookieID = req.session.user_id;
  const user = getUserByID(userCookieID, users);
  const { longURL } = req.body;
  const shortURL = generateRandomString();
    
  urlDatabase[shortURL] =  { userID: userCookieID, longURL: longURL } 
  const urls = urlsForUser(userCookieID);

  const templateVars = { 
    url: urls, 
    user_id: user.id, 
    user_email: user.email };
  res.render("urls_index", templateVars );
  
  
  
  // let g = generateRandomString();
  // urlDatabase[g] = {};
  // urlDatabase[g].longURL = req.body.longURL;
  // urlDatabase[g].userID = req.session.user_id;
  // res.redirect(`/urls/${g}`);        
});

    


// GET - url/new
app.get("/urls/new", (req, res) => {
  const userCookieID = req.session.user_id;
  const user = getUserByID(userCookieID, users);
  if (!user){
    res.redirect("/login");
  } else {
    const templateVars = {
    url: urlDatabase,
    user_id: req.session.user_id,
    user_email: user.email
  }
  res.render("urls_new", templateVars);
  }
});

// POST - url/new
app.post("/urls/new", (req, res) => {
  let newUrlId = generateRandomString();

  if (!urlDatabase[newUrlId]) {
    urlDatabase[newUrlId] = {
      longURL: req.body.longURL,
      userID: req.session.user_id 
    }
  }
  res.redirect("/urls/" + newUrlId);
});
  
// GET - url/:shortURL
app.get("/urls/:id", (req, res) => {
  const userCookieID = req.session.user_id;
  const user = getUserByID(userCookieID, users);
  if (!user) { return res.send('You must login first! Please <a href="/login">Try again</a>') }

  if (urlDatabase[req.params.id].userID !== req.session.user_id) { return res.status(403).send('Sorry, only the user can view this page!') }

  const longURL = urlDatabase[req.params.id].longURL;
  const templateVars = { 
    user_id: req.params.id, 
    id: req.params.id, 
    longURL: longURL, 
    user_email: user.email};
  res.render("urls_show", templateVars);
});
  
// POST - urls/:shortURL  - Edit the LongURL
app.post("/urls/:id", (req, res) => {
  const updatedURL = req.params.id;
  urlDatabase[updatedURL].longURL = req.body.longURL;
  res.redirect("/urls");
  
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) { return res.send('This URL does not exist'); }
  if(longURL.includes('http')){ res.redirect(longURL); }
  else{ res.redirect('http://' + longURL); }  
});

//POST - urls/:shortURL/delete -delete
app.post(("/urls/:id/delete"), (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls")
});


// LOGIN Page
app.get("/login", (req, res) => {
  const templateVars = {
    url: urlDatabase, 
    user_id: null
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
app.get("/register", (req, res) => {
  const templateVars = { url: urlDatabase, user_id: null };
  res.render("register", templateVars);
});




// POST - Register   
app.post("/register", (req, res)=>{
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Error");
  }
  if (getUserByEmail(email)) {return res.status(400).send("Email already exists, Please <a href='/register'> Try again</a>")}

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

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
});

