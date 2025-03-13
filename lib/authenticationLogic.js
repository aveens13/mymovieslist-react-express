const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const { createToken } = require("./jwt");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const maxAge = 3 * 24 * 60 * 60; //Maximum age for the token to be valid
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const nodeMailer = require("nodemailer");

dotenv.config();
const otps = new Map();

//Checks for token if it is valid or not and send response to the client
exports.checktoken = (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.status(400).send({
            status: false,
            error: "Session has expired",
          });
        } else {
          const user = await prisma.user.findUnique({
            where: {
              user_id: decodedToken.id,
            },
          });
          res.status(200).send({
            success: true,
            data: decodedToken,
            userName: user.name,
            userImage: user.imageURL,
          });
        }
      }
    );
  } else {
    res.status(400).send({
      status: false,
      error: "Need to Login to access",
    });
  }
};

//User authentication part
//Logs the user in
exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = createToken(user.user_id, maxAge);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).send(user);
      } else {
        res.status(401).send({
          status: "passworderror",
          error: "Incorrect Password",
        });
      }
    } else {
      res.status(400).send({
        status: "emailerror",
        error: "Please Check your email and try again.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Email does not exist");
  }
};

//User sends a post request to this endpoint and this generates a otp and send it to the user's mail
exports.signup_post = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP(); // Generate a 6-digit OTP
    otps.set(email, otp);
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ETHERAL_EMAIL_USER,
        pass: process.env.ETHERAL_EMAIL_PASS,
      },
    });

    transporter
      .sendMail({
        from: '"Movieridge Admin 👻" <aveenavbhattarai@gmail.com>', // sender address
        to: email,
        subject: "OTP Code - MovieRidge Signup",
        text: `Your OTP is ${otp}, Enjoy watching Movieridge`,
      })
      .then(() => {
        console.log("Email Sent");
      })
      .catch((err) => {
        console.error(err);
      });

    res.status(201).json({
      success: true,
      result: `OTP sent successfully to ${email}`,
      sentTo: email,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ success: false, result: "Server Error while sending code" });
  }
};

//This endpoints validates the user's otp and creates a user in the database
exports.validateOTP = async (req, res) => {
  const { otp, email, name, password } = req.body;
  try {
    if (otp == otps.get(email)) {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      const token = createToken(user.user_id, maxAge);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      otps.delete(email);
      return res.status(200).send({ success: true, userId: user.user_id });
    } else {
      return res.status(401).send({ success: false, result: "OTP wrong" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).send({ success: "false", result: error.message });
  }
};
exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).send({
    success: true,
  });
};

// Generate OTP using randomstring of length
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}
