import express from "express";
import db from "../config/db.js";
import { ensureAuth } from "../middleware/isAuthenticated.js";

const router= express.Router();

router.get("/journel/new",ensureAuth,(req,res)=>{
    res.render("journel/create.ejs");
});

router.get("/journel/:id/edit",ensureAuth,async(req,res)=>{
    const {id}=req.params;
    try{
        const result= await db.query("SELECT * FROM journels WHERE id =$1 AND user_id=$2",
            [id,req.user.id]
        );
        if(result.rows.length===0){
            res.redirect("/dashboard");
        }else{
            res.render("journel/edit",{
                journels:result.rows[0]
            });
        }
    }catch(err){
        console.log(err);
        res.send(`Error updating journel`);
    }
});

router.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is alive 🚀" });
});

router.post("/journel/new",ensureAuth,async(req,res)=>{
    const {title,content}= req.body;
    try{
        await db.query("INSERT INTO journels(title,content,user_id) VALUES($1,$2,$3);",
        [title,content,req.user.id]);
        res.redirect("/dashboard");
    }catch(err){
        console.log(err);
        res.send(`Error creating journel`); 
    }
});
router.put("/journel/:id",ensureAuth,async(req,res)=>{
    const {id} = req.params;
    const {title,content} =req.body;
    try{
        await db.query("UPDATE journels SET title=$1,content=$2 WHERE id =$3 AND user_id=$4",
            [title,content,id,req.user.id]
        );
        res.redirect("/dashboard");
    }catch(err){
        console.log(err);
        res.send(`Error while updating journel`);
    }
});

router.delete("/journel/:id",ensureAuth,async(req,res)=>{
    const {id} = req.params;
    try{
        await db.query("DELETE FROM journels WHERE id =$1 AND user_id=$2",[id,req.user.id]);
        res.redirect("/dashboard");
    }catch(err){
        console.log(err);
        res.send(`Error Detecting Deleting Journel`);
    }
});

// Export all journals for current user as JSON
router.get("/journel/export", ensureAuth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, title, content, created_at, is_pinned, is_favorite FROM journels WHERE user_id=$1 ORDER BY created_at ASC;",
      [req.user.id]
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="journal-entries.json"'
    );
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    res.send(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.log(err);
    res.status(500).send("Error exporting journals");
  }
});

export default router;