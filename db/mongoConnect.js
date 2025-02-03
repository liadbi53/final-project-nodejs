const mongoose = require('mongoose');
// מאפשר לדבר עם משתני אינווירמנט
require("dotenv").config()
main().catch(err => console.log(err));

async function main() {
  // console.log(process.env.TOKEN_SECRET)
  // יש לשנות את שם התקייה האחרונה לשם המסד נתונים
  // שלנו
  //await mongoose.connect(process.env.DB_CONNECT);
   await mongoose.connect('mongodb://127.0.0.1:27017/toys');
   console.log("mongo connect arial_nov24 atlas");
  
  //use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}