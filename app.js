// Requireing all the neccessary modules
const database = require("/Users/ravi/Desktop/octo/datastore.js"); // SQL Database linked using Sequelize ORM
const express = require('express');
const cors = require('cors');
const multer = require("multer");
const fileupload = require("express-fileupload");
const path = require("path") ;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const aws = require("aws-sdk");
const {ACCESS_KEY , SECRET_ACCESS_KEY , BUCKET_NAME } = require("/Users/ravi/Desktop/octo/config.js"); //AWS configuration
const fs = require('fs');

const app = express();
// enable files upload
app.use(fileupload());
//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));


//Configuration of AWS S3 for uploading files to the cloud...
const s3 = new aws.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
});

//Function for uploading the file to AWS S3...
const uploadFile = (file) => {
    // Read content from the file
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: file.name, // File name you want to save as in S3
        Body: file.data
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

//Configuration of Multer in case local storage is required at a later stage...
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".jpg")
    }
  });

const maxSize = 1 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      }

// mypic is the name of file attribute
}).single("mypic");


//Routes of the API defined...


//1.This route lists all the upcoming events scheduled...
app.get("/upcomingevents", function(req, res) {

  const da = database.Event.findAll({
    raw: true,
    attributes: ['title', 'description', 'date']
  }).then((data) => {
    if(data[0])
    res.send(data);
    else
    res.send("No events scheduled...")
    }).catch((error) => {
    console.error(error);
  }).finally(()=>{
      console.log("Success");
  });

});


//2.This route allows the user to create an event...
app.get("/createEvent", function(req, res) {

  res.send("Event created successfully...")
});

app.post("/createEvent",function(req, res,next) {

  const ev = database.Event.create({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location,
    allowed_attendees: req.body.allowed_attendees,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  }).then((evt) => {
    console.log(evt);

    upload(req,res,function(err) {

        if(err) {

            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err);
        }
        else {

            // SUCCESS, image successfully uploaded
            uploadFile(req.files.mypic);
            res.send("Event created successfully....");
        }
    });

      /*_.forEach(_.keysIn(req.files.photos), (key) => {

        let photo = req.files.photos[key];
        let imagepath = './uploads/' + photo.name;
        cnt = cnt+1;

        database.Image.create({
          id:cnt,
          imagePath: imagepath,
          eventId:evt.id
        }).then((data)=>{
          console.log(data);
        }).catch((error)=>{
          console.error(error);
        }).finally(()=>{
          console.log("Images uploaded..");
        });

      });*/
      //console.log(photo.mv);
  }).catch((error) => {
    console.error(error);
  });

});

//3.This route allows the user to delete a scheduled event..
app.get("/deleteEvent", function(req, res) {

  res.send("Deleted Successfully...");
});

app.post("/deleteEvent", function(req, res) {

  database.Event.destroy({
    where: {
      id: req.body.id,
      title: req.body.title
    }
  }).then((res) => {
    console.log(res);
    console.log("Deleted Successfully...");
  }).catch((error) => {
    console.error(error);
  });
  res.redirect("/deleteEvent");

});

//4.This route returns the attendees for a particular event...
app.get("/getAttendeesForEvent",function(req,res){

  res.send("Printed on console...");
});

app.post("/getAttendeesForEvent", function(req, res) {

  const evt = database.Event.findAll({
    raw: true,
    attributes: ['id'],
    where: {
      id: req.body.id,
      title: req.body.title
    }
  }).then((data) => {

    database.Attendee.findAll({
      raw: true,
      attributes: ['userId'],
      where: {
        eventId: data[0].id
      }
    }).then((record) => {

      record.forEach((user) => {

        database.User.findAll({
          raw: true,
          attributes: ['id', 'name', 'email'],
          where: {
            id: user.userId
          }
        }).then((final) => {
          console.log(final);
        }).catch((error) => {
          console.error(error);
        });

      });

    }).catch((error) => {
      console.error(error);
    });

  }).catch((error) => {
    console.error(error);
  });
  res.redirect("/getAttendeesForEvent");

});

//5.This route is meant for registration of a new user..
app.get("/createUser",function(req,res){
  res.send("User created successfully...");
});

app.post("/createUser",function(req,res){

  const newUser = database.User.create({
    name:req.body.name,
    email:req.body.email
  }).then((data)=>{
    console.log(data);
  }).catch((error)=>{
    console.error(error);
  });
  res.redirect("/createUser");
});


//6.This route is meant for deleting a user record...
app.get("/deleteUser",function(req,res){
  res.send("User deleted successfully...");
});

app.post("/deleteUser",function(req,res){

  database.User.destroy({

    where:{
    id:req.body.id,
    name:req.body.name,
    email:req.body.email
  }

  }).then((data)=>{
    console.log(data);
  }).catch((error)=>{
    console.error(error);
  });
  res.redirect("/deleteUser");
});


//start app in the background
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);
