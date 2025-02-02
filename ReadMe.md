# 🎲 Toys API - Node.js & MongoDB

API לניהול משתמשים וצעצועים עם אימות מבוסס `JWT` ושימוש ב-`MongoDB`.

## 🚀 התקנה והפעלה  

### 1️⃣ התקנת חבילות  
```bash
npm install

users api:
Method	Route	Description
POST	/users	יצירת משתמש חדש
POST	/users/login	כניסת משתמש וקבלת טוקן
GET	/users	שליפת כל המשתמשים (Admin בלבד)
GET	/users/info	קבלת פרטי המשתמש המחובר
PATCH	/users/role/:id/:role	שינוי תפקיד משתמש (Admin בלבד)

toys api:
GET	/toys	קבלת רשימת צעצועים עם דפדוף (?skip=10)
GET	/toys/single/:id	שליפת צעצוע לפי ID
POST	/toys	הוספת צעצוע (משתמש מחובר בלבד)
PUT	/toys/:id	עדכון צעצוע (רק המשתמש שיצר אותו)
DELETE	/toys/:id	מחיקת צעצוע (רק המשתמש שיצר אותו)

security:
JWT Token: כל הבקשות פרט ל-/users/login ו-/users מחייבות שליחת טוקן ב-x-api-key.
Admin Only: פעולות רגישות כמו GET /users ו-PATCH /users/role פתוחות רק ל-ADMIN.

השתמשתי ב:
Node.js עם Express.js
MongoDB עם Mongoose
JWT לאימות משתמשים
Bcrypt להצפנת סיסמאות
Joi לאימות קלט מהמשתמש