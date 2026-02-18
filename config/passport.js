import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./db.js";

passport.use(new Strategy(
    {usernameField:"email"},
    async(email,password,done)=>{
        try{
            const result= await db.query("SELECT * FROM users WHERE email=$1",[email]);
            const user=result.rows[0];
            if(result.rows.length===0){
                done(null,false);
            }
            const isMatch= await bcrypt.compare(password,user.password);
            if(!isMatch){
                return done(null,false);
            }
            return done(null,user);
        }catch(err){
            return done(err);
        }
    }
));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    try{
        const result= await db.query("SELECT * FROM users WHERE id =$1",[id]);
        done(null,result.rows[0]);
    }catch(err){
        done(err);
    }
});