require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const moment = require("moment");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path')


const app = express();
const PORT = process.env.PORT || 4000;



mongoose.connect(process.env.DB_URI); 
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", ()=> console.log("connected"));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use(
    session({
        cookie: { maxAge: 6000},
        secret:"my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use(cookieParser('secret'));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next()
});

app.use(express.static("uploads"));


app.set('view engine', 'ejs');

app.use("", require("./routes/routes"));



app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
})