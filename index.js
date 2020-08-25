const express= require("express")
const mongoose = require("mongoose")
const cors= require("cors")
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

require("dotenv").config()
app.use(express.json())
app.use(cors())
let uri = process.env.MONGO_URI;
mongoose.connect(uri,{useNewUrlParser:true,useCreateIndex:true});
mongoose.connection.once("open",()=>{
	console.log("Connected to mongo successfully!");

});

const QuizSchema =new mongoose.Schema({
	question:{type:String,required:true},
	options:{type:Array, required:true},
	ca:{type:String,required:true},
	difficulty:{type:String, required:true},
	tag:{type:String,required:true}
},{timestamps:true});


const Quiz = mongoose.model("Quiz",QuizSchema);
app.get("/addquiz",(req,res)=>{
	res.render("addquiz.ejs");
});
app.post("/addquiz",(req,res)=>{

	const 	question = req.body.question;
	const options= req.body.options;
	const ca= req.body.ca;
	const difficulty= req.body.difficulty;
	const tag = req.body.tag;
	const newQuiz = new Quiz({
		question,
		options,
		ca,
		difficulty,
		tag,
	});
	newQuiz.save().then(()=>{
	console.log("Data Save successfully!")
	res.redirect("/addquiz")}).catch((err)=>console.log("Error"+err));
});
app.get("/listquiz",(req,res)=>{
	Quiz.find().then((quizs)=>{
		res.json(quizs);
	}).catch(err=>{
		res.json("error");
		console.log("error"+err)
	});

});
app.get("/",(req,res)=>{
	res.send("This is home page")
})
const port= process.env.PORT||5000;
app.listen(port,()=>{
	console.log("Server successfully started at PORT: "+port);
});



