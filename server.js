const mongoose= require("mongoose");
const express= require("express");
const parser= require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const cm = require('./customsessions');

cm.sessions.startCleanup();


const saltNumber= 5;

const connection_string='mongodb://127.0.0.1:27017/final_project';

mongoose.connect(connection_string, {useNewUrlParser:true});
mongoose.connection.on("error",()=> {
	console.log("Connection to mongodb produced an error")	
});



var UserSchema = new mongoose.Schema(  {
		username: String,
  	hash: String,
  	games:[{type:mongoose.Schema.ObjectId, ref:"Score"}],
  	highscore: String,
  	highscorediff:String,
  	gamenumber:{type:Number,default:0},
});

var ScoreSchema = new mongoose.Schema(  {
  	time:String,
  	difficulty: String,
});

var Score = mongoose.model("Score",ScoreSchema);

var User = mongoose.model("User",UserSchema);

const app=express();

function authenticate(req, res, next) {
  let c = req.cookies;
  if (c && c.login) {
    let result = cm.sessions.doesUserHaveSession(c.login.username, c.login.sid);
    if (result) {

      next();
      return;
    }
  }
  res.redirect('/index.html');
}

app.use(cookieParser());
app.use("index.html",express.static("public_html/index.html"));    
app.use('/home.html', authenticate);
app.use('/difficulty.html', authenticate);
app.use(express.static("public_html"));
app.use(parser.json());


app.post("/add/user/", (req, res) =>{//used for creating user
	console.log(req.body);
	bcrypt.genSalt(saltNumber)
	  .then(salt => {
	    return bcrypt.hash(req.body.password, salt)
	  })
	  .then(hash => {
	   var c= new User({username:req.body.username, hash:hash});
	   c.highscore="90:00:00";
		c.save()
		.catch( (error) => {
	        console.log('THERE WAS A PROBLEM');
	        console.log(error);
	    	});
		})
	  .catch(err => console.error(err.message));
    res.send();
});



app.post("/gamepage/", (req, res) =>{//used for logging the user in
	const username=req.cookies.login.username;
	User.find({username:username}).exec().then(results=>{
		if (results.length==1){
			var score= new Score(req.body);
			score.save().then(()=>{
				results[0].games.push(score);
				results[0].gamenumber+=1;
				if (results[0].highscore>req.body.time){
					results[0].highscore=req.body.time;
					results[0].highscorediff=req.body.difficulty;
				}
				results[0].save();
			})
		}
	})
	res.send();
});


app.post("/get/users/", (req, res) =>{//used for logging the user in
	const user=req.body.username;
	const password=req.body.password;
	User.find({username:user}).exec().then(results =>{
		if (results.length==1){
		bcrypt.compare(password, results[0].hash).then((flag)=>{
			if (flag){
				res.cookie("login",{username:user, sid:cm.sessions.addOrUpdateSession(user)}, {maxAge:cm.sessions.SESSION_LENGTH});
				res.send("successful");			}
			else{
				res.send("Failed Login");
			}
		})
		.catch(error =>{
			console.log(error);
		})
		}
		else{
			res.send("Failed Login");
		}
	
	});
});

app.get("/leaderboard/", (req, res) =>{
	var username= ["$","$","$"];
	var highscores= ["10:00:00","10:00:00","10:00:00"];
	var difficulty=["$","$","$"];
	var array=[username,highscores,difficulty];
		User.find({}).exec().then(results=>{
		for (var i in results){
		if (results[i].highscore < highscores[0] || highscores[0] === '10:00:00') {
      highscores[2] = highscores[1];
      highscores[1] = highscores[0];
      highscores[0] = results[i].highscore;
      username[0]=results[i].username;
      difficulty[0]=results[i].highscorediff;
    } else if ((results[i].highscore < highscores[1] || highscores[1] === '10:00:00') && results[i].highscore !== highscores[0]) {
      highscores[2] = highscores[1];
      highscores[1] = results[i].highscore;
      username[1]=results[i].username;
      difficulty[1]=results[i].highscorediff;
    } else if ((results[i].highscore < highscores[2] || highscores[2] === '10:00:00') && results[i].highscore !== highscores[0] && results[i].highscore !== highscores[1]) {
      highscores[2] = results[i].highscore;
      difficulty[2]= results[i].highscorediff;
      username[2]=results[i].username;
    }
		}
	})
		res.send(array);
});

app.listen(80, () => { //starts up the server
    console.log(`Server running at http://localhost/`);
  });