//importing necessary Libs
const fetch = require('node-fetch');
var express = require('express');
const scheduledTask = require('./scheduler')
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var usersRouter = require('./routes/users');
const Axios = require('axios');
var app = express();
var jsonParser = bodyParser.json()

//calling Scheduler function
scheduledTask();


//Stuff to show when the server is loaded. 
app.get('/', (req, res) => {
  console.log( );
    res.send('Hello Slackbot!');
  });


  //call when user actually 
  app.post('/timedoct',urlencodedParser,async function(req,res) {
    const query = encodeURIComponent(req.body.text);
    res.send("Processing your Query");
    //calling a function to get task ID
    getTaskID(query.toString())
     
  })

//when /ai command is executed
async function getTaskTime(taskID, name) {

 //gettig last week's monday's date
  let today = new Date(); // get today's date
  let lastMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7 - 7); // calculate last Monday's date
  let formattedDate = lastMonday.toISOString(); // format the date in ISO format
  
  //gettig last week's friday date
  let currentDate = new Date(); // get current date
  let lastFridayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() + 6) % 7 - 2); // calculate last Friday's date
  let formattedLastFridayDate = lastFridayDate.toISOString(); // format the date in ISO format
   
  
  //api call
  const query = new URLSearchParams({
        company: 'Y2Uuqv49XA0GADkC',
        detail: 'all',
        token: '1BjSdI-67JHi1cB7Vzyl9whm0y8vO4q0J1OWtm_uZNAo', 
        from : formattedDate, 
        to: formattedLastFridayDate
      }).toString();
      const task = taskID.toString();
      const company = 'Y2Uuqv49XA0GADkC';
      const apiKey = '1BjSdI-67JHi1cB7Vzyl9whm0y8vO4q0J1OWtm_uZNAo';
  
  const url = `https://api2.timedoctor.com/api/1.0/stats/mode-ratio?company=${company}&task=${task}&from=${formattedDate}&to=${formattedLastFridayDate}&token=${apiKey}`
      const resp = await fetch(
        url,
        {method: 'GET'}
      );

  //calculating number of hours      
  const data = await resp.text();
  var datum = (JSON.parse(data)); 
  const users = datum.data.users;
  let sum = 0;
  for (let i = 0; i < users.length; i++) {
    sum += users[i].total;
  }
  let hours = Math.floor(sum / 3600); // calculate total hours
  let minutes = Math.floor((sum % 3600) / 60); // calculate remaining minutes
  let todays = new Date();
  let lastMondays = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate() - (todays.getDay() + 6) % 7 - 7);
  let lastFridays = new Date(todays.getFullYear(), todays.getMonth(), todays.getDate() - (todays.getDay() + 6) % 7 - 3);
  
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let lastWeekMondayDate = lastMondays.toLocaleDateString('en-US', options);
  let lastWeekFridayDate = lastFridays.toLocaleDateString('en-US', options);


  const res = name+ "-->"+ hours + "h " + minutes + "m";
  const rep = `Report from ${lastWeekMondayDate} \u{1F447} to ${lastWeekFridayDate} \u{1F4C5} for ${name} is ${hours}hours ${minutes} Minutes`;
  //posting it on Slack
  const slackResult = await Axios.post(process.env.WEBHOOK, {
    text : rep,
  })
  
  
    }

    //function that gets id of all the tasks and filters the task user wants
    async function getTaskID(nameOfComp) {
      //info necessary to make api call
      const projectId = 'Y2UusOII1DZcBDBX'; // replace with your project id
      const apiKey = '1BjSdI-67JHi1cB7Vzyl9whm0y8vO4q0J1OWtm_uZNAo'; // replace with your API key
      const company = 'Y2Uuqv49XA0GADkC'; // replace with your company id
      const url = `https://api2.timedoctor.com/api/1.0/tasks?company=${company}&token=${apiKey}`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.text();
      const result = {};
     // console.log(data);
      let datum = JSON.parse(data)
      let name = nameOfComp;
        //filtering task user wants
        datum.data.forEach(item => {
          if (item.name.toLowerCase().includes(name.toLowerCase())) {
            //calling a function to 
            getTaskTime(item.id, item.name);
          }
        });
    }

//do not edit any of these. APP SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"))
app.use('/', indexRouter);
app.use('/users', usersRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App available at http://localhost:${port}`);
  });
module.exports = app;





