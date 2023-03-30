const cron = require('node-cron');
const Axios = require('axios');
const scheduledTask = () => {
  cron.schedule('*/9 * * * *', () => {
    // Replace the console.log() statement with your desired code to be executed
    let today = new Date();
let lastMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7 - 7);
let lastFriday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7 - 3);

let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let lastWeekMondayDate = lastMonday.toLocaleDateString('en-US', options);
let lastWeekFridayDate = lastFriday.toLocaleDateString('en-US', options);

console.log(`Report from ${lastWeekMondayDate} \u{1F447} to ${lastWeekFridayDate} \u{1F44C}`); // Output: Report from Monday, March 21, 2023 👇 to Friday, March 25, 2023 👌
   const rep = `Report from ${lastWeekMondayDate} \u{1F447} to ${lastWeekFridayDate} \u{1F4C5}`;
const slackResult =  Axios.post(process.env.WEBHOOK, {
    text : rep,
  })
getAllTasks()
  });
};
async function getAllTasks() {

    const projectId = 'Y2UusOII1DZcBDBX'; // replace with your project id
    const apiKey = '1BjSdI-67JHi1cB7Vzyl9whm0y8vO4q0J1OWtm_uZNAo'; // replace with your API key
    const company = 'Y2Uuqv49XA0GADkC'; // replace with your company id
    
    const url = `https://api2.timedoctor.com/api/1.0/tasks?company=${company}&token=${apiKey}`;
    
    const response = await fetch(url, { method: 'GET' });
    const data = await response.text();
    const result = {};

   // console.log(data);
    let datum = JSON.parse(data)
    console.log(typeof datum)
    datum.data.forEach(item => {
       // console.log(`ID: ${item.id}, Name: ${item.name}`);
     
       getTaskUsers(item.id, item.name);
      });
   
  }

  async function getTaskUsers(taskID, name) {

 
    let today = new Date(); // get today's date
    let lastMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7 - 7); // calculate last Monday's date
    let formattedDate = lastMonday.toISOString(); // format the date in ISO format
    
    
    let currentDate = new Date(); // get current date
    let lastFridayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() + 6) % 7 - 2); // calculate last Friday's date
    let formattedLastFridayDate = lastFridayDate.toISOString(); // format the date in ISO format
     // output: "2023-03-25T00:00:00.000Z"
    
    
    
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
    const data = await resp.text();
    var datum = (JSON.parse(data)); 
    //console.log(datum.data.users)
    const users = datum.data.users;
    let sum = 0;
    
    for (let i = 0; i < users.length; i++) {
      sum += users[i].total;
    }
    let hours = Math.floor(sum / 3600); // calculate total hours
    let minutes = Math.floor((sum % 3600) / 60); // calculate remaining minutes
    //console.log(name, "-->", hours + "h " + minutes + "m")
    const res = name+ "-->"+ hours + "h " + minutes + "m";
    // const slackResult = await Axios.post(, {
    //   text : res,
    // })
    
    if(hours > 40) {
        const res = name+ ": "+ hours + "h " + minutes + "m" + ' \u274E' ; 
        console.log(res); 
        const slackResult = await Axios.post(process.env.WEBHOOK, {
      text : res,
    })
    }
    else {
        const res = name+ ": "+ hours + "h " + minutes + "m" + ' \u274C' ; 
       const slackResult = await Axios.post(process.env.WEBHOOK, {
      text : res,
    }) 
    }
    
    
    
      }



module.exports = scheduledTask;