import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import passport from "passport";
import { ensureAuth } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("auth/register.ejs");
});

router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard")
    }
    const successMsg = req.query.registered ? "Successfully registered! Please log in." : null;
    res.render("auth/login.ejs", { success: successMsg });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
    const result = await db.query("SELECT * FROM journels WHERE user_id=$1 ORDER BY created_at DESC;",
        [req.user.id]
    );
    res.render("journel/dashboard", {
        journels: result.rows
    });
});

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    })
})

router.post("/register", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    try {
        if (password !== confirmPassword) {
            return res.send("Retype Password");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users(email,password) VALUES($1,$2);", [email, hashPassword]);
        res.redirect("/login?registered=true");
    } catch (err) {
        if (err.code === "23505") {
            res.send(`This email already exists,Registration failed`);
        }
        console.log(err);
    }
});

router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    })
);

export default router;