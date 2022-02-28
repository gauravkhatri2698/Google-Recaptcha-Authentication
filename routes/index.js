var express = require('express');
var request = require('request');
var router = express.Router();
var dotenv = require('dotenv');

dotenv.config({ path: './.env' });

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index');
});

router.post('/captcha', function (req, res) {
  // console.log("hello", req.body);

  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({ "responseError": "something goes to wrong" });
  }
  const secretKey = process.env.SECRET_KEY;
  // console.log("hello again by captcha response", req.body['g-recaptcha-response']);
  // console.log("secret key", secretKey);

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.socket.remoteAddress;

  request(verificationURL, function (error, response, body) {
    if (error) {
      // console.log("error", error);
      return res.status(404).json({error});
    }

    else {
      body = JSON.parse(response.body);
      // console.log("body", body);

      if (body.success !== undefined && !body.success) {
        return res.status(404).json({ "responseError": "Failed captcha verification"});
      }
      return res.status(200).json({ "responseSuccess": "Success" });
    }
  });
});

module.exports = router;
