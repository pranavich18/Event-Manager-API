const express = require("express");
const app = express();
const cors = require("cors");
const fs = require('fs');
const aws = require("aws-sdk");

app.use(cors());

const ACCESS_KEY = "AKIAIEN43Z6XATRBBSVA";
const SECRET_ACCESS_KEY = "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";
const BUCKET_NAME = "myimagesocto";

const s3 = new aws.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
});

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);
    console.log(fileContent);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'cat.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};


app.get("/",function(req,res){

  uploadFile("/Users/ravi/Desktop/octo/uploads/mypic-1606215570222.jpg");
});


app.listen(4000,function(){
  console.log("Server running on port 4000...");
});
