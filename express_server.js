const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080


app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: [req.params.id].longURL };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send(" Request Success"); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post(("/urls/:id/delete"), (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls")
});

// login page
// app.get("/login", (req, res) => {
//   const templateVars = { url: urlDatabase, user_id: null };

//   res.render("login", templateVars);
// });

app.get("/login", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
});



app.post('/login', (req,res) => {
  const {email, password} = req.body;
	// const {error, user} = authenticateUser(email, password);
	if(error) {
		console.log(req,cookies)
		return res.redirect("/urls");
	}
		res.cookie("username", username )
		return res.redirect("/urls");
	//res.render()
	});



// app.post("/login", (req, res) => {
// 	const {email, password} = req.body;
// 	const {error, user} = authenticateUser(email, password);
// 	if(error) {
// 		console.log("error:", error)
// 		return res.redirect("/");
// 	}
// 		res.cookie("email", email )
// 		return res.redirect("/");

// 	});



// app.post("/login", (req, res) => {
// if(!userDatabaseIsh[req.body.email]) {
// 		console.log("Email doesn't exist");
// 	return res.redirect("/");
// 	}
// //Password doesn't match
// if (uesrDatabaseIsh[req.body.eamil].password !== req.body.password) {
// 		console.log("Password bad")
// 		return res.redirect("/");
// }
// 	res.json(userDatabaseIsh[req.body.email]);
// });