const {google} = require('googleapis');
const gmailConfig = require('config').get('gmailConfig');
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];
const Q = require('q');

const oAuth2Client = new google.auth.OAuth2(
  gmailConfig.client_id,
  gmailConfig.client_secret,
  gmailConfig.redirect_uri
);

oAuth2Client.setCredentials({
  "access_token":gmailConfig.token,
  "token_type":"Bearer",
  "refresh_token":gmailConfig.refresh_token
});

function makeBody(to, from, subject, message) {
  let str = [
    "Content-Type: text/plain; charset=\"UTF-8\"\n",
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ", to, "\n",
    "from: ", from, "\n",
    "subject: ", subject, "\n\n",
    message
  ].join('');

  let encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
  return encodedMail;
}

function sendEmail(to, from, subject, message) {
  let deferred = Q.defer();
  let gmail = google.gmail({version: 'v1', auth:oAuth2Client});
  gmail.users.messages.send({userId: 'me',
    resource: {
      'raw': makeBody(to, from, subject, message)
    }
  }, function(err, data) {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(data)
    }
  });
  return deferred.promise;
}

module.exports = {sendEmail};

