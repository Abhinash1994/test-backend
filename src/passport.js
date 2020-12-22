import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import config from './config';
import { db } from './models';
import bcrypt from 'bcrypt-nodejs';

var TokenExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['XSRF-token'];
    }
    return token;
}


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: TokenExtractor,
    secretOrKey: config.app.secret,
}, async (payload, done) => {
    try {
        var user = null;
        if (payload.iam == "user") user = await db.user.findOne({ where: { id: payload.sub }, attributes: ['id', 'firstname', 'lastname', 'email', 'companyId', 'password', 'attempt', 'loggedOutAt', 'status', 'valid', 'createdAt', 'resetPassword'], required: true, include: [{ model: db.Company }] });
        else if (payload.iam == "root") {
            user = await db.User.findOne({ where: { id: payload.sub }, attributes: ['id', 'firstname', 'lastname', 'email', 'companyId', 'password', 'attempt', 'loggedOutAt', 'status', 'valid', 'createdAt', 'resetPassword'], required: true, include: [{ model: db.Company }] });
        }
        if (!user) {
            return done('user', false);
        }
        user.type = payload.iam;
        const tokenDate = new Date(payload.iat);
        if (user.loggedOutAt != null && (tokenDate.getTime() - user.loggedOutAt.getTime()) < 0) {
            return done('invalid', false);
        }

        if (new Date(payload.exp) < new Date()) {
            return done('expired', false);
        }
        if (user.resetPassword) {
            return done(null, user, 'resetPassword/' + user.email);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await db.User.findOne({ where: { email: email }, attributes: ['id', 'firstname', 'lastname', 'email', 'password'], required: true, })
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    }
    catch (error) {
        done(error, false);
    }
}));


// IAM ROOT STRATEGY
passport.use('root-login', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await db.User.findOne({
            where: {
                email: email
            },
            attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'createdAt',]
        });
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    } catch (error) {
        done(error, false);
    }
}));

//customer-strategy
passport.use('customer-root-login', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await db.customer.findOne({
            where: {
                email: email
            },
            attributes: ['id', 'firstname', 'lastname', 'email', 'password', 'createdAt',]
        });
        if (!user) {
            return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    } catch (error) {
        done(error, false);
    }
}));

