if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const cookieParser = require('cookie-parser');

const dbUrl = process.env.ATLASDB_URL;
   
async function main() {
    await mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connected to DB");
    }).catch((err)=> {
        console.log(err);
    });
} 

main();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());

const userRouter = require("./routes/user.js");
const courseRouter = require("./routes/course.js");
const adminRouter = require("./routes/admin/user.js");

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", courseRouter);

app.all("*", (req, res) => {
  res.status(400).send("Wrong request");
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});