const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
 
//require MailChimp and async
const mailchimp = require("@mailchimp/mailchimp_marketing");
const async = require('async');
 
const app = express();
 
//Setting up our static path and Body Parser
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
  extended: true
}));
 
//This code comes from MailChimp's github and is now required to configure Mailchimp to be able to interface with your account.
mailchimp.setConfig({
  apiKey: '8fb627bc3f5d6e425260a26d7d3f88bb-us14',
  server: 'us14',
});
 
//Sending the signup page when someone comes to our website
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})
 
//Our post function for after they hit submit.  Grabs the data they sent to us so that we can send it to MailChimp.
app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  const listId = "1448984f67";
  console.log(firstName);
  console.log(lastName);
  console.log(email);
 
//This creates a function for us to run later that sends the info to MailChimp.  Part of this comes straight from the MailChimp guide, the rest is for handling the response.
  async function run() {
 
//try/catch is used in an async function to catch any errors that come back.  Like if/else, it can run a different set of instructions based on what comes back.
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      })
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }
  };
 
  //running the function created above.  Will probably have to save the response in a variable in order to do the failure/success part of the lessons.
  run();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.post("/success", function(req,res){
    res.redirect("/");
});
 
//Our listener that opens the server
app.listen(process.env.PORT || 3000, function() {
  console.log("I am so depressed.  Brain the size of a planet, but here I am starting your server on port 3000.  Shut up Marvin!!");
});

