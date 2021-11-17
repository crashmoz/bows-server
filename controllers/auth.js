const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const passportJWT = require('passport-jwt');
// const jwt = require('jsonwebtoken');

// const ExtractJwt = passportJWT.ExtractJwt;
// const jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
// jwtOptions.secretOrKey = process.env.SECRET;

module.exports.controller = (app) => {
	// Configure Strategy
	passport.use(
		new LocalStrategy((username, password, done) => {
			User.getUserByUsername(username, (err, user) => {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: "Incorrect username." });
				}
				User.comparePassword(password, user.password, (error, isMatch) => {
					if (isMatch) {
						return done(null, user);
					}
					return done(null, false, { message: "Incorrect password." });
				});
				return true;
			});
		})
	);

	app.post("/auth/login", passport.authenticate("local"), (req, res) => {
		res.json({ message: "Login success", data: req.user });
	});

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	app.get("/auth/current_user", isLoggedIn, (req, res) => {
		if (req.user) {
			res.send({ current_user: req.user });
		} else {
			res.status(401).send({ success: false, msg: "Unauthorized." });
		}
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status(401).send({ message: req.isAuthenticated() });
		}
	}

	// app.get("/api/user", authMiddleware, (req, res) => {
	//   let user = users.find(user => {
	//     return user.id === req.session.passport.user
	//   })

	//   console.log([user, req.session])

	//   res.send({ user: user })
	// })

	// function authMiddleware(req, res, next) {
	// 	if (!req.isAuthenticated()) {
	// 		res.status(401).send("You are not authenticated");
	// 	} else {
	// 		return next();
	// 	}
	// };

	app.get("/auth/logout", (req, res) => {
		req.logout();
		res.status(200).send({ message: 'Logout success' });
	});

	// app.post('/users/login', (req, res) => {
	// 	if (req.body.username && req.body.password) {
	// 		const username = req.body.username;
	// 		const password = req.body.password;
	// 		User.getUserByUsername(username, (err, user) => {
	// 			if (!user) {
	// 				res.status(404).json({ message: 'The user does not exist!' });
	// 			} else {
	// 				User.comparePassword(password, user.password, (error, isMatch) => {
	// 					if (error) throw error;
	// 					if (isMatch) {
	// 						const payload = { id: user.id };
	// 						const token = jwt.sign(payload, jwtOptions.secretOrKey);
	// 						res.json({ message: 'ok', token });
	// 					} else {
	// 						res.status(401).json({ message: 'The password is incorrect!'});
	// 					}
	// 				});
	// 			}
	// 		});
	// 	};
	// });
}
