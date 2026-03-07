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
    const errorMsg = req.query.error ? req.query.error : null;
    res.render("auth/login.ejs", { success: successMsg, error: errorMsg });
});

router.get("/dashboard", ensureAuth, async (req, res) => {
    const result = await db.query("SELECT * FROM journels WHERE user_id=$1 ORDER BY created_at DESC;",
        [req.user.id]
    );
    res.render("journel/dashboard", {
        journels: result.rows,
        currentUser: req.user
    });
});

router.get("/profile", ensureAuth, async (req, res) => {
    // Get count of user's journals for the profile page
    const countResult = await db.query("SELECT COUNT(*) FROM journels WHERE user_id=$1", [req.user.id]);
    const journalCount = parseInt(countResult.rows[0].count, 10) || 0;
    
    res.render("journel/profile", {
        currentUser: req.user,
        journalCount: journalCount
    });
});

router.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    })
})

router.post("/register", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    try {
        if (password !== confirmPassword) {
            return res.render("auth/register.ejs", { error: "Passwords do not match." });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users(name,email,password) VALUES($1,$2,$3);", [name, email, hashPassword]);
        res.redirect("/login?registered=true");
    } catch (err) {
        if (err.code === "23505") {
            return res.render("auth/register.ejs", { error: "This email is already registered." });
        }
        console.log(err);
        res.render("auth/register.ejs", { error: "Registration failed. Please try again." });
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { 
            const msg = info && info.message ? info.message : "Invalid email or password.";
            return res.redirect("/login?error=" + encodeURIComponent(msg)); 
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect("/dashboard");
        });
    })(req, res, next);
});

export default router;