const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config;
const URL = process.env.DB;
// const bcryptjs = require("bcrypt");
// const jwt = require("jsonwebtoken");

// Middleweare
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get('/', (req, res) => {
  res.send('hello world')
});

// let authenticate = function (req, res, next) {
//   if (req.headers.authorization) {
//    try {
//     let verify = jwt.verify(req.headers.authorization,);
//     if (verify) {
//       req.userid = verify._id;
//       next();
//     } else {
//       res.status(401).json({ message: "Unauthorized" });
//     }
//    } catch (error) {
//     res.status(401).json({ message: "Unauthorized" });
//    }
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

app.post("/login", async function (req, res) {
  try {
    // Open the Connection
    const connection = await mongoClient.connect(URL);
    // Select the DB
    const db = connection.db("blog");
    // Select the Collection
    const user = await db.collection("users").findOne({ email: req.body.email });

    if (user) {
      res.json({
        message: "Successfully Logged In",
      });
      // const match = await bcryptjs.compare(req.body.password, user.password);
      if (match) {
        // Token
        // const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "1m" });
        res.json({
          message: "Successfully Logged In",
          // token,
        });
      } else {
        res.status(401).json({
          message: "Password is incorrect",
        });
      }
    } else {
      res.status(401).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/service", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    let student = await db.collection("users").find().toArray();
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
  }
});


app.post("/register", async function (req, res) {
  try {
    // Open the Connection
    const connection = await mongoClient.connect(URL);
    // Select the DB
    const db = connection.db("blog");
    // Select the Collection
    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(req.body.password, salt);
    // req.body.password = hash;
    await db.collection("users").insertOne(req.body);
    // Close the connection
    await connection.close();
    res.json({
      message: "Successfully Registered",
    });
  } catch (error) {
    res.json({
      message: "Error",
    });
  }
});

app.post("/servicereq", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    await db.collection("request").insertOne(req.body);
    await connection.close();
    res.json({
      message: "Successfully Request",
    });
  } catch (error) {
    res.json({
      message: "Error",
    });
  }
});

app.put("/servicereq/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    let student = await db
      .collection("request")
      .updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });
    await connection.close();
    res.json({
      message: "updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/register/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    let student = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
  }
});


app.listen(process.env.PORT || 3001);