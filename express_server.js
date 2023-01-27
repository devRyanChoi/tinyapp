const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require('./helpers')
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

function generateRandomString() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newString = '';
  for (let a = 0; a < 6; a++) {
    newString += alphabet[Math.floor(Math.random() * Math.floor(alphabet.length - 1)) + 1];
        
  }
  return newString;
}

const urlForUser = (id, urlDatabase) => {
  let userUrls = {};
  for (let shortURL in urlDatabase) {
    if(urlDatabase[shortURL].userID === id) {
      matchingURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
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
  // const userCookieID = req.session.user_id;
  // const urls = urlsForUser(userCookieID);
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


// GET - u/:shortURL - 업데이트 전
// app.get("/u/:shortURL", (req, res) => {
//   const longURL = urlDatabase[req.params.shortURL];
//   res.redirect(longURL);
// });
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
  
  if (urlDatabase[req.params.shortURL].userID !== req.session.user_id) {
    console.log("Warning! Invalid user came!");
    return res.status(403).send("Only user can access");
  }
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
  let userID = userMatching(users, req.body.email);
  function userMatching(users, email) {
    for (let u in users) {
      if (email === users[u].email) {
        return u;
      }
    }
    return false;
  }
  console.log(userID.id);
  if(!userID) {
    res.status(403).send("Invalid email")
  } else {
    req.session.user_id = userID;
    res.redirect("/urls");
  }

  const email = req.body.email;
  const password = req.body.password;
  if(bcrypt.compareSync(password, user.password)) {
    console.log(user.id);
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(403).send('Incorrect password, please try again');
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
  let getEmail = req.body.email;
  let getPassword = req.body.password;
  if (getEmail === '' || getPassword === '') {
    console.log("error");
    return res.status(400).send("Error");
  }

  for (let keys in users) {
    if (users[keys].email === getEmail) {
      return res.status(400).send("email already exitsts");
    }
  }

  const hashedPassword = bcrypt.hashSync(getPassword, 10);
  
  let userID = generateRandomString();
   
  users[userID] = {
    id: userID, 
    email: req.body.email, 
    password: hashedPassword,
  };
    
  req.session.user_id = users[userID].id;
  res.redirect("/urls");
});