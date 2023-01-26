const getUserByEmail = function(email, database) {
  for ( user in database) {
    if(users[user].email === email) {
      return users[user];
    }
  };

  return user;
};


module.exports = { getUserByEmail }