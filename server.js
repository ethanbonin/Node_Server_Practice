//Inside package.json Make sure too add a script that starts this.
//You start it with npm start

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//process.env stores all enviroment vairables as key value pairs
const _PORT = process.env.PORT || 3000;
var app = express();

//We are telling express what view engine we want to use.
app.set('view engine', 'hbs');

//You have to explicity say where the directory is.
//underscore underscore dirname '__dirname' is the complete path to this root directory
app.use(express.static(__dirname + '/public'));


//Partials allow you to render partial markups like the footer that needs to be at everypage.
hbs.registerPartials(__dirname + '/views/partials');

//This gets registered to everywhere that calls {currentYear}
//Which is in the footer of every page
hbs.registerHelper('currentYear', () => {
  return new Date().getFullYear();
});


//This is the maintenence middleware
// app.use((req, res, next) => {
//   res.render('mainten.hbs');
// })


//You have to call next() to handlers to get called
//else nothing will ever get called
//This is middle ware

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url} ${req.ip} ${req.hostname} ${req.cookies}`;
  console.log(log);

  //fs requires a callback function
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log(err);
    }
  })
  next();
});

//This is the routing of the website.
//This is hte root of the website.
//The app.get requires to arguments. the extention, and the function inside of it
//The response has a bunch of functions
app.get('/', (req, res) => {
  res.render('index.hbs', {
    pageTitle: "HomePage",
  })
});

//This binds the app to a port to listen to.
//This allows us to render the hbs extention
//You can send informationg with json format.
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: "About Page",
  })
});


app.get('/bad', (req,res) => {

  res.send({
    errorMessage: "Error, You have seen this error",
    status: 400,
  });

});


app.listen(_PORT, () => {
  console.log(`Server is up on port: ${_PORT}`);
});
