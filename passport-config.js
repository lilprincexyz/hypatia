const passport = require('passport');
const {User} = require('./models');
const LocalStrategy = require('passport-local');

class PassportConfig{ 
	configurePassport(app) {
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

		this.passport = passport;

		return passport;
	}
	getPassport() {
		return this.passport;
	}
}	

module.exports = new PassportConfig();