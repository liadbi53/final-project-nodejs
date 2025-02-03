const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel,userValid,loginValid,createToken} = require("../models/userModel")
const {auth, authAdmin} = require("../middlewares/auth")
const router = express.Router();

router.get("/",async(req,res) => {
  res.json({msg:"Users endpoint"});
})

router.get("/list",authAdmin,async(req,res) => {
  try {
    const limit = 10;
    const skip = req.query.skip || 0;
    const data = await UserModel
    .find({},{password:0})
    .limit(limit)
    .skip(skip)
    res.json(data);  
  } 
  catch (error) {
    console.log(error);
    res.status(502).json({err:"There problem come back later"})
  }
})


router.get("/info", auth,async(req,res) => {
  try{
    // req.tokenData._id - מגיע מהפונקציה שלה האוט בשרשור
    // {password:0} - יציג את כל המאפיינים מלבד את הסיסמא אם היה 1 היה מציג
    // רק את הסיסמא ומסתיר את האחרים
    const data = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(data)
  }
  catch (error) {
    console.log(error);
    res.status(502).json({err:"There problem come back later"})
  }
})


router.post("/",async(req,res) => {
  const validBody = userValid(req.body);
  // בודק אם הבאדי לא תקין
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const user = new UserModel(req.body);
    // הצפנת הסיסמא במסד
    user.password = await bcrypt.hash(user.password,10);
    await user.save();
    // הסתרת הסיסמא המוצפנת מהצד לקוח
    user.password = "*******"
    res.status(201).json(user)
  }
  catch (error) {
    // בודק אם השגיאה שהמייל קיים במסד
    if(error.code == 11000){
      return res.status(400).json({err:"Email already in system",code:11000})
    }
    console.log(error);
    res.status(502).json({err:"There problem come back later"})
  }
})

router.post("/login",async(req,res) => {
  const validBody = loginValid(req.body);
  // בודק אם הבאדי לא תקין
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    // אם קיים במסד אצלנו בכלל מייל שנשלח מהבאדי
    const user = await UserModel.findOne({email:req.body.email})
    if(!user){
      // 401 - שגיאת אבטחה
      return res.status(401).json({msg:"Email not found"})
    }
    // נבדוק שהסיסמא של הבאדי תואמת לסיסמא המוצפנת במסד
    const passwordValid = await bcrypt.compare(req.body.password,user.password)
    if(!passwordValid){
      return res.status(401).json({msg:"password worng !"})
    }
   
    // נשלח למשתמש טוקן
    const token = createToken(user._id,user.role);
    //  res.json({token}) ->  res.json({token:token})
    // shorcut props - כאשר שם של משתנה/פרמטר זהה לשם של מאפיין
    // אין צורך לכתוב אותו שוב
    res.json({token})
  }
  catch (error) {
    console.log(error);
    res.status(502).json({err:"There problem come back later"})
  }
})

// ראוטר שהופך משתשמש על ידי אדמין לתפקיד אחר
router.patch("/role/:id/:role", authAdmin, async(req,res) => {
  try{
    const id = req.params.id;
    const role = req.params.role;
    console.log(role);
    console.log(id);
    // יעדכן לפי איי די של המשתמש את הרול
    const data = await UserModel.updateOne({_id:id},{role:role})
    res.json(data);
  }
  catch (error) {
    console.log(error);
    res.status(502).json({err:"There problem come back later"})
  }
})

module.exports = router;