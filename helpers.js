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

const getUserByEmail = (email, users) => {
  for ( user in users) {
    if(users[user].email === email) {
      return users[user];
    }
  };

  return false;
};

const fetchUserInfo = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return undefined;
};

function generateRandomString() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newString = '';
  for (let a = 0; a < 6; a++) {
    newString += alphabet[Math.floor(Math.random() * Math.floor(alphabet.length - 1)) + 1];
        
  }
  return newString;
}

module.exports = { getUserByID, urlsForUser, getUserByEmail, fetchUserInfo, generateRandomString}

