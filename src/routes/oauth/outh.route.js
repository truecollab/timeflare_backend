const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

//microsoft callback url
app.get('/microsoft/auth/callback',
  passport.authenticate('oauth-bearer', { session: false }),
  (req, res) => {
    // Authentication successful, extract user information
    const user = req.user;

    // Optionally, store user information in session or database
    req.session.user = user;
    console.log(user);

    // Redirect or respond with success message
    res.send('Authentication successful');
  }
);



const authenticateMicrosoftGraph = passport.authenticate('oauth-bearer', { session: false });

// Example API endpoint to fetch user's profile from Microsoft Graph API
router.get('/api/me', authenticateMicrosoftGraph, (req, res) => {
    // Access token obtained from JWT
    const accessToken = req.user.accessToken;

    // Initialize Microsoft Graph client with access token
    const client = graph.Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    // Make request to Microsoft Graph API to fetch user's profile
    client.api('/me').get((err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
});


module.exports = router;