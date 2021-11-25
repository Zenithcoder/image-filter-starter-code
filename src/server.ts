import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
const fs = require('fs');
const path = require("path");

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {

    const keys = Object.keys(req.query);
    // Do we have enough query parameters?
    if (!keys.length){
      return res.status(422).send('Please select an image url to upload');
    } 
  

    const testFolder = __dirname +'/util/tmp/';
   
    let files: any[] = [];
    
    const getFilesRecursively = (directory: any) => {
      const filesInDirectory = fs.readdirSync(directory);
      for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
        } else {
            files.push(absolute);
        }
      }
    };

    getFilesRecursively(testFolder);
    deleteLocalFiles(files);


    let image_url = req.query.image_url;
    let filteredpath = filterImageFromURL(image_url);
    
    res.status(422).sendFile(await filteredpath);

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("Welcome to Image filter service")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();