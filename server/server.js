const express = require("express");

const cors = require("cors");

const db = require("./database");

const app = express();

app.use(cors());

app.use(express.json());


// GET ALL STUDENTS

app.get(

"/students",

(req,res)=>{

db.query(

"SELECT * FROM students",

(err,result)=>{

if(err){

return res

.status(500)

.json(err);

}

res.json(result);

}

);

}

);


// ADD STUDENT

app.post(

"/students",

(req,res)=>{

const {name}

=req.body;

db.query(

"INSERT INTO students(name) VALUES(?)",

[name],

(err)=>{

if(err){

return res

.status(500)

.json(err);

}

db.query(

"SELECT * FROM students",

(err,result)=>{

res.json(result);

}

);

}

);

}

);


// MARK PRESENT

app.put(

"/students/:id/present",

(req,res)=>{

const id=

req.params.id;

db.query(

"UPDATE students SET present_count=present_count+1 WHERE id=?",

[id],

()=>{

db.query(

"SELECT * FROM students",

(err,result)=>{

res.json(result);

}

);

}

);

}

);


// MARK ABSENT

app.put(

"/students/:id/absent",

(req,res)=>{

const id=

req.params.id;

db.query(

"UPDATE students SET absent_count=absent_count+1 WHERE id=?",

[id],

()=>{

db.query(

"SELECT * FROM students",

(err,result)=>{

res.json(result);

}

);

}

);

}

);


// DELETE STUDENT

app.delete(

"/students/:id",

(req,res)=>{

const id=

req.params.id;

db.query(

"DELETE FROM students WHERE id=?",

[id],

()=>{

db.query(

"SELECT * FROM students",

(err,result)=>{

res.json(result);

}

);

}

);

}

);


// EDIT STUDENT NAME

app.put(

"/students/:id/edit",

(req,res)=>{

const id=

req.params.id;

const {name}

=req.body;

db.query(

"UPDATE students SET name=? WHERE id=?",

[name,id],

()=>{

db.query(

"SELECT * FROM students",

(err,result)=>{

res.json(result);

}

);

}

);

}

);


// RESET ATTENDANCE

app.put(

"/students/:id/reset",

(req,res)=>{

const id=

req.params.id;

db.query(

"UPDATE students SET present_count=0, absent_count=0 WHERE id=?",

[id],

()=>{

db.query(

"SELECT * FROM students",

(err,result)=>{

res.json(result);

}

);

}

);

}

);


app.listen(

5000,

()=>{

console.log(

"Server running on port 5000"

);

}

);