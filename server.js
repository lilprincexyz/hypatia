//required installs
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const religionRouter = require('./religionRouter');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Religion, User} = require('./models');

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
app.use('/religion', religionRouter);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

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