var express = require ('express');
var bodyParser = require ('body-parser');
var path =require('path');
var ejs = require('ejs');
var mysql = require('mysql');
var router =express.Router();

var port=4008;

var app = express();

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

app.get('/',function(req,res){
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
    	res.render('Index',{"userlist":userlist});
  });

});
});
app.listen(port);

console.log('Server started on port '+port);

module.exports =app;