//required installs
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const religionRouter = require('./religionRouter');
const flash = require('connect-flash');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {Religion, User} = require('./models');
const passportConfig = require('./passport-config');

//middleware configs
const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(session({secret: "my hypatia secret"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(flash());
const passport = passportConfig(app);
app.use('/religion', religionRouter);

app.get("/login", (req, res) => {
  res.render("login");
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/religion',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get("/newUser", (req, res) => {
  res.render("newUser");
})

app.post('/newUser', (req, res) => {
  const requiredFields = ['username', 'password'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  //req.body instead of all required fields
  const newUser = User.create(req.body)
    .then(user => {
      console.log(JSON.stringify(user))

      // console.log(JSON.stringify(apiRepr))
      res.redirect('/religion');
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
})

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      console.log(databaseUrl);
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
	
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) { 
  runServer().catch(err => console.error(err)); 
}

module.exports = { app, runServer, closeServer};