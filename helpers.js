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

module.exports = { getUserByEmail, fetchUserInfo, generateRandomString}

