const { Strategy: JwtStrategy, ExtractJwt, Strategy: GoogleStrategy  } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// const googleStrategy = new GoogleStrategy(
//   {
//     clientID: config.google.clientId,
//     clientSecret: config.google.clientSecret,
//     callbackURL: config.google.callbackURL,
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const user = await User.findOrCreate({ googleId: profile.id });
//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   }

  
// );
 
module.exports = {
  jwtStrategy
  
};
