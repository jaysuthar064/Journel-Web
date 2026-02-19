import express from "express";
import db from "./config/db.js";
import router from "./routes/authRoutes.js";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import journelRoutes from "./routes/journelRoutes.js"
import methodOverride from "method-override";


const app = express();
const port=process.env.PORT || 3000;
dotenv.config();


app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
});
app.use(router);
app.use(journelRoutes);


app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index");
});

const result = await db.query("SELECT current_database()");
console.log(result.rows);

await db.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await db.query(`
CREATE TABLE IF NOT EXISTS journels (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);


app.listen(port,()=>{
    console.log(`Server is runnig on port ${port}`);
});

