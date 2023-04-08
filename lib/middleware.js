const bcrypt = require("bcrypt");

//Hashing the password before saving it to the database
exports.hashPassword = async (req, res, next) => {
  console.log(req.body);
  const salt = await bcrypt.genSalt();
  req.body.password = await bcrypt.hash(req.body.password, salt);
  next();
};
