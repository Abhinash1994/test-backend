import passport from 'passport';
import JWT from 'jsonwebtoken';
import config from '../config';

var JWTSign = function(user, date){
    return JWT.sign({
        iss : config.app.name,
        sub : user.id,
        iat : date.getTime(),
        exp : new Date().setMinutes(date.getMinutes() + 30)
    }, config.app.secret);
}

export var jwtStrategy = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        let contype = req.headers['content-type'];
        var json = !(!contype || contype.indexOf('application/json') !== 0);
        if (err && err == 'expired'){ return json?res.status(500).json({ errors: ['Session is expired']}):res.redirect('/logout'); }
        if (err && err == 'invalid'){ return json?res.status(500).json({ errors: ['Invalid token recieved']}):res.redirect('/logout'); }
        if (err && err == 'user'){ console.log('1'); return json?res.status(500).json({ errors: ['Invalid user recieved']}):res.redirect('/logout'); }
        if (err && Object.keys(err).length) { return res.status(500).json({ errors: [ err ]}); }
        if (err) { console.log(err); return res.status(500).json({ errors: [ 'Invalid user recieved' ]}); }
        if (!user) { return json?res.status(500).json({ errors: ['Invalid user recieved']}):res.redirect('/logout'); }
        
        //Update Token
        var date = new Date();
        var token = JWTSign(user, date);
        res.cookie('XSRF-token', token, {
            expire: new Date().setMinutes(date.getMinutes() + 30),
            httpOnly: true, secure: config.app.secure
        });

        req.user = user;
        next();
    })(req, res, next);
};

export var jwtLogoutStrategy = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(user){
            req.user = user;
        }
        next();
    })(req, res, next);
};


export var rootLoginStrategy = (req, res, next) => {
    passport.authenticate('root-login', {
        session: false
    }, (err, user, info) => {
        if (err && err.startsWith("resetpassword")) { var email = err.split("/"); return res.status(200).json({ isnewuser: 1, email: email[1] }); }
        if (err && err == 'invalid') { return res.status(401).json({ errors: ['Email Id not verified'] }); }
        if (err && err == 'attempt') { return res.status(401).json({ errors: ['Too many invalid attempts. Please reset your password.'] }); }
        if (err) { return res.status(401).json({ errors: [err] }); }
        if (!user) { return res.status(401).json({ errors: ['Invalid Credentials'] }); }
        if (err && err.keyword.startsWith('attempt:')) { return res.status(401).json({ errors: ['Invalid Credentials (' + err.split(':')[1] + ' Attempt(s) Left)'] }); }
        user.type = "root";
        req.user = user;
        next();
    })(req, res, next);
};

export var localStrategy = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log(err);
        //if (err && err.startsWith("isNewUser")) { var email = err.split("/"); return res.status(200).json({ isnewuser: 1, email: email[1] }); }
        if (err && err == 'invalid') { return res.status(500).json({ errors: ['Email Id not verified']}); }
        if (err && err == 'attempt') { return res.status(500).json({ errors: ['Too many invalid attempts. Please reset your password.']}); }
        if (err && err.startsWith('attempt:')) { return res.status(500).json({ errors: ['Invalid Credentials (' + err.split(':')[1]+' Attempt(s) Left)']}); }
        if (err) { return res.status(500).json({ errors: [ err ]}); }
        if (!user) { return res.status(401).json({ errors: ['Invalid Credentials']}); }
        req.user = user;
        next();
    })(req, res, next);
};