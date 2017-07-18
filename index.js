var express = require ('express');
var bodyParser = require ('body-parser');
var path =require('path');
var ejs = require('ejs');
var mysql = require('mysql');
var router =express.Router();
var bcrypt = require('bcryptjs');
var session = require('express-session');
var un;

var port=4012;

var app = express();

app.use(session({secret: 'ssshhhhh'}));

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123456",
	database: "mydb"
});



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!")



  

//post start

app.post("/", function(req, res){
 console.log("Adding Commment...")
  	var UserName = req.body.User_Name;
  	var UserComment = req.body.User_Comment;

  var sql = "INSERT INTO comments (name, comment) VALUES ('"+UserName+"' ,'"+UserComment+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");

    res.writeHead(302, {
  'Location': '/'
});
res.end();
  });
});
// post end


//post start

app.post("/ind", function(req, res){
 console.log("Deleting Commment...")
  	var gID = req.body.ID;
  	  var sql = "DELETE FROM comments WHERE ID = '"+gID+"'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted");

    res.writeHead(302, {
  'Location': '/'
});
res.end();
  });
});
// post end

//post start

app.post("/index", function(req, res){
 console.log("Updating Commment...")
  	var gID = req.body.ID;
  	var gname = req.body.User_Name;
  	var gcom = req.body.User_Comment;
  	console.log(gname);
  	console.log(gcom);
  	  var sql = "UPDATE comments SET name='"+gname+"',comment='"+gcom+"' WHERE ID = '"+gID+"'";
  	  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.writeHead(302, {
  'Location': '/'
});
res.end();
  });
});
// post end


app.use(function(req, res, next){
	console.log('Starting...');
	next();
});

var sess;
app.get('/login',function(req,res){
  sess=req.session;
  sess.email;
  if(sess.email){
    res.redirect('/');
  }
  else
  {
  res.render('login');
}
});



app.post('/signup',function(req,res){
    var UserName = req.body.name;
    var Email=req.body.email;
    var Password = req.body.password;

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(Password, salt, function(err, hash){
        Password = hash;
    console.log(UserName,Email,Password);

      var sql = "INSERT INTO users (Name,Email,Password) VALUES ('"+UserName+"' ,'"+Email+"','"+Password+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 User Added");

    res.writeHead(302, {
  'Location': '/login'
});
res.end();
});

  
});
});
});
app.post('/log',function(req,res){
    sess=req.session;
    username=req.body.User_Name;
    password= req.body.Password;
    con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;

    var user;
    
    for(var i=0;i<result.length;i++)
    {
       user = {
            'Name':result[i].Name,
            'Email':result[i].Email,
            'Password':result[i].Password
            }
      if(user.Email==username)
      {
        un=user.Name;
         bcrypt.compare(password, user.Password, function(err, isMatch){
        if(err) {
          console.log(err);
        }
        if(isMatch){
          console.log("Match");
          sess.email=username;
          res.redirect("/");
        } else {
          console.log("Sorry No Match");
        }

      });
    } 
}
});
});
});

app.get('/',function(req,res){
  sess=req.session;
  if(sess.email){
  var userlist=[];
  con.query("SELECT * FROM comments", function (err, result, fields) {
    if (err) throw err;
 
    var userc;

    for(var i=0;i<result.length;i++)
    {
       userc = {
            'ID':result[i].ID,
            'UserName':result[i].name,
            'UserComment':result[i].comment
            }
          userlist.push(userc);  
    }
      res.render('Index',{"userlist":userlist,"un":un,"login":true});
  });
}
else
{
  res.render('index',{"login":false})
}

});

app.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/login');
  }
});
});

app.listen(port);

console.log('Server started on port '+port);

module.exports =app;