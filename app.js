const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
// const request = require("request");
const fs = require("fs");
const sample = require("./public/round1json/sample.json");


app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

var username;
var rollno ;
var name ;
var questionno = -1;
var wrongcodeoutput, rightcodeoutput, ans = "Output Will Show Here",scoreround1 = 0,counter = 0,round1done = 0,round2done = 0;

mongoose.connect(
    `mongodb+srv://avi:ag_1022000_@cluster0.y0fpc.mongodb.net/pcc-project?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
).then(()=>console.warn('Database connection is done'));


const usersSchema = {
    username : String,
    rollno : String,
    arr1: Array,
    temparr : Array,
    score1 : Number,
    score2 : Number
}


const  User = mongoose.model('User',usersSchema);

// const user1 = new User({
//     username : "avijit ghosh",
//     rollno : 205321004,
//     score1 : 0,
//     score2 : 0
// })


app.get('/',(req,res) => {
    res.render(`${__dirname}/Client/indexfront.ejs`);
});



app.get('/login',(req,res) => {
    res.render(`${__dirname}/Client/login.ejs`);

});


app.post('/login', async(req, res) => {
    try{
        // const username = req.body.username;
        // const rollno = req.body.rollno;

        username = req.body.username;
        rollno = req.body.rollno;

        // const name = await User.findOne({username:username});
        name = await User.findOne({username:username});

        if (!name){
            // no result
            let newuser = new User({
                username : username,
                rollno : rollno,
                arr1 : [],
                temparr : [],
                score1 : Number(0),
                score2 : Number(0)
            })
            newuser.save();
            res.redirect('/logout');
        }
        else{
            // do something with result
            if(name.rollno === rollno){
                res.redirect('/logout');
            }
            else{
                res.send("Roll No. doesn't match");
            }
        }
    }
    catch(error){
        res.status(400).send("Invalid Username");
    }
});


app.get('/logout',(req,res) => {
    res.render(`${__dirname}/Client/indexfrontlogout.ejs`);
});


app.get('/round1',async(req,res) => {
    // Apr 20, 2022 12:00:00
    // Apr 16, 2022 01:01:00
    // console.log(new Date("Apr 16, 2022 01:01:00"));
    // console.log(new Date());

    if(new Date("Apr 15, 2022 12:00:00") >= new Date()){
        res.render(`${__dirname}/Client/livepage.ejs`);
    }
    else if(round1done == 1){
        res.render(`${__dirname}/Client/indexfrontlogout.ejs`)
    }
    else{
        // round1done = 1;
        name = await User.findOne({rollno:rollno});
        console.log(name);
        if(name.arr1.length != 0 ){
            if(name.temparr.length == name.arr1.length){
                round1done == 1;
                return res.redirect('/logout');
            }
        }
        console.log(name.arr1);
        if(name.arr1.length == 0){
            let list = [1, 2, 3, 4, 5];
            name.arr1 = list.sort(() => Math.random() - 0.5);
            console.log(name.arr1);
            // name.save();
        }

        // var questionno = -1;
        questionno = -1;
        for (let i = 0; i < name.arr1.length; i++) {
            var element = name.arr1[i];
            if(name.temparr.indexOf(element) == -1){
                questionno = element;
                name.temparr.push(element);
                // name.save();
                break;
            }
        }
        name.save();

        // console.log(questionno);
        // var wrongcodefile = sample[questionno-1].wrongcodefile;
        // console.log(wrongcodefile);
        // console.log("./code/"+wrongcodefile);
        // const wrongcodefilebuffer = fs.readFileSync("./code/"+wrongcodefile);
        // const wrongcodefileContent = wrongcodefilebuffer.toString();
        // console.log(wrongcodefileContent);

        res.render(`${__dirname}/Client/indexround1.ejs`,{questionno:questionno,ans:ans,scoreround1:scoreround1});
    }
    
});


app.post('/round1',async(req, res) => {
    try{
        
        name = await User.findOne({rollno:rollno});
        console.log(name);

        var inputbox = req.body.inputbox;
        console.log(inputbox);
        // console.log(typeof(inputbox));


        // let rawdata = fs.readFileSync('sample.json');
        // let users = JSON.parse(rawdata);
        // let obj = JSON.stringify(users);
        // console.log(users);

        // var wrongcode = sample[questionno].wrongcode;

        // console.log(wrongcode);
        // console.log(typeof(wrongcode));
        
        // console.log(sample[0].wrongcode);
        // console.log(typeof(sample[0].wrongcode));
        
        // var rightcode = sample[questionno].rightcode;

        
        // var file = sample[questionno].file;
        // console.log(file);
        // console.log("./"+file);
        // const buffer = fs.readFileSync("./"+file);
        // // use the toString() method to convert Buffer into String
        // const fileContent = buffer.toString();
        // console.log(fileContent);
        
        // console.log(rightcode);
        // console.log(typeof(rightcode));
        
        // console.log(sample[0].rightcode);
        // console.log(typeof(sample[0].rightcode));
        
        console.log(questionno);
        // console.log(obj[questionno]);

        
        var wrongcodefile = sample[questionno-1].wrongcodefile;
        console.log(wrongcodefile);
        console.log("./code/"+wrongcodefile);
        const wrongcodefilebuffer = fs.readFileSync("./code/"+wrongcodefile);
        const wrongcodefileContent = wrongcodefilebuffer.toString();
        console.log(wrongcodefileContent);


        var rightcodefile = sample[questionno-1].rightcodefile;
        console.log(rightcodefile);
        console.log("./code/"+rightcodefile);
        const rightcodefilebuffer = fs.readFileSync("./code/"+rightcodefile);
        const rightcodefileContent = rightcodefilebuffer.toString();
        console.log(rightcodefileContent);

        var wrongcodeobj = {
            "type" : 'serial', 
            "code" : wrongcodefileContent, 
            "lang" : 'cpp', 
            "user_id" : rollno, 
            "input" : inputbox,
            "time_limit" : '1'  
        }
        
        console.log(wrongcodeobj);


        var rightcodeobj = {
            "type" : 'serial', 
            "code" : rightcodefileContent, 
            "lang" : 'cpp', 
            "user_id" : rollno, 
            "input" : inputbox,
            "time_limit" : '1'  
        }

        console.log(rightcodeobj);
        // sleep(1000);
        // ---------------------------
        request.post(
            'http://127.0.0.1:5000/run_api',
            { 
                json: wrongcodeobj
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    wrongcodeoutput = body;
                }
            }
            );
            console.log(wrongcodeoutput["output"]);
            console.log(wrongcodeoutput);
            // console.log(wrongcodeoutput.output);
        
        // setTimeout(1000);
        // await sleep(1000);

        request.post(
            'http://127.0.0.1:5000/run_api',
            { 
                json: rightcodeobj
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    rightcodeoutput = body;
                }
            }
            );
            console.log(rightcodeoutput["output"]);
            console.log(rightcodeoutput);
            // await timeout(1000);
            // await sleep(1000);   
            // console.log(rightcodeoutput.output);
        // -------------------------

        // sleep(1000);
        // request.post(
        //     'http://127.0.0.1:5002/run_api',
        //     {
        //         json: 
        //         {
        //             type : 'serial', 
        //             code : wrongcode, 
        //             lang : 'cpp', 
        //             user_id : rollno, 
        //             input : inputbox,
        //             time_limit : '1'  
        //         }
        //         // {
        //         //     "type":"serial", 
        //         //     "code" : 'wrongcode', 
        //         //     "lang" : 'cpp', 
        //         //     "user_id" : 'rollno', 
        //         //     "input" : 'inputbox',
        //         //     "time_limit" : '1'  
        //         // }
        //         // {
        //         //     todo: 'Buy the milk',
        //         // },
        //     },
        //     (error, res, body) => {
        //         if (error) {
        //             // console.error(error)
        //             // return
        //         }
        //         // console.log(`statusCode: ${res.statusCode}`)
        //         console.log(body)
        //     }
        // );


        // {
                //     type : 'serial', 
                //     code : wrongcode, 
                //     lang : 'cpp', 
                //     user_id : rollno, 
                //     input : inputbox,
                //     time_limit : '1'  

                //     // "type":"serial", 
                //     // "code" : 'wrongcode', 
                //     // "lang" : 'cpp', 
                //     // "user_id" : 'rollno', 
                //     // "input" : 'inputbox',
                //     // "time_limit" : '1'  
                // } 
        // name.score1 = Number(req.body.score1);
        // name.save();
        // console.log(name.score2);

        res.redirect('/runcode');
        // res.render(`${__dirname}/Client/indexround1.ejs`,{questionno:questionno});

    }
    catch(error){
        res.status(400).send("Error");
    }
    
});


app.get('/runcode',async(req, res) => {
    try{
        // name = await User.findOne({rollno:rollno});
        // console.log(name);
        
        // if(name.temparr.length == name.arr1.length){
        //     return res.redirect('/logout');
        // }
        // else{
            
        //     console.log(name.temparr);
        //     questionno = name.arr1[name.arr1.indexOf(name.temparr[name.temparr.length-1])+1];
        //     name.temparr.push(questionno);
        //     console.log(name.temparr);
        //     name.save();
        // }

        if(wrongcodeoutput["output"] == rightcodeoutput["output"]) {
            ans = "Wrong Answer";
        }
        else{
            ans = "Right Answer";
            if(counter == 0){
                scoreround1 = scoreround1 + 5;
                counter = 1;
            }
        }

        res.render(`${__dirname}/Client/indexround1.ejs`,{questionno:questionno, ans:ans, scoreround1:scoreround1});
    }
    catch(error){
        res.status(400).send("Error");
    }
});



app.post("/update_score", async(req, res) => {
    //var roll = req.session.rollno;
    //name = await User.findOne({rollno:rollno});
    // Increase the score
})

app.get('/next',async(req, res) => {
    try{
        name = await User.findOne({rollno:rollno});
        console.log(name);
        
        if(name.temparr.length == name.arr1.length){
            round1done = 1;
            return res.redirect('/logout');
        }
        else{
            
            console.log(name.temparr);
            questionno = name.arr1[name.arr1.indexOf(name.temparr[name.temparr.length-1])+1];
            name.temparr.push(questionno);
            console.log(name.temparr);
            name.save();
        }
        counter = 0;
        ans = "Output Will Show Here";
        res.render(`${__dirname}/Client/indexround1.ejs`,{questionno:questionno,ans:ans,scoreround1:scoreround1});
    }
    catch(error){
        res.status(400).send("Error");
    }
});


app.post('/round1/next',async(req, res) => {
    try{

        name = await User.findOne({rollno:rollno});
        console.log(name);

        name.score1 = Number(req.body.score1);
        name.save();
        // console.log(name.score2);

        res.redirect('/logout');
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});


app.post('/round1/submit',async(req, res) => {
    try{
        console.log(req.body.score1);
        // score2 = req.body.score2;
        
        name = await User.findOne({rollno:rollno});
        console.log(name);
        
        name.score1 = Number(req.body.score1);
        name.save();
        // console.log(name.score2);
        round1done = 1;

        res.redirect('/logout');
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});




app.get('/round2',async(req,res) => {
    // res.render(__dirname + "/Client/indexwordsearch.ejs", {myWords:myWords});
    // res.render(__dirname + "/Client/indexwordsearch.ejs", {word1:word1,word2:word2,word3:word3});
    if(new Date("Apr 15, 2022 12:00:00") >= new Date()){
        res.render(`${__dirname}/Client/livepage.ejs`);
    }
    else if( round1done == 0 || round2done == 1){
        res.render(`${__dirname}/Client/indexfrontlogout.ejs`)
    }
    else{
        round2done = 1;
        name = await User.findOne({rollno:rollno});

        console.log(name);

        res.render(__dirname + "/Client/indexwordsearch.ejs", {score1:name.score1});
        // res.render(`${__dirname}/Client/indexwordsearch.ejs`);
    }
    
});


app.post('/round2',async(req, res) => {
    try{
        round2done = 1;
        console.log(req.body.score2);
        // score2 = req.body.score2;

        name = await User.findOne({rollno:rollno});
        console.log(name);

        name.score2 = Number(req.body.score2);
        name.save();
        // console.log(name.score2);

        res.redirect('/logout');
    }
    catch(error){
        res.status(400).send("Error");
    }
    
});

let port = process.env.PORT;

if(port == null || port == ""){
    port = 3000;
}

app.listen(port);

