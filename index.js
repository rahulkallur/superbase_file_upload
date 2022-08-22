const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const multer = require("multer");
var app = express();
app.use(cors());

let { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://pkeosknanvmwrrmirmim.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZW9za25hbnZtd3JybWlybWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk3OTI0MjUsImV4cCI6MTk3NTM2ODQyNX0.3x9ORYFqDS2dzeIAYPfLJs1ZXkrquNMaqPW28RmzZuo"
const BUCKET_NAME = "uploads"
const supabaseKey = SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// const storage = multer.diskStorage({
//   destination: "./",
//   filename: (req, file, cb) => {
//     let fileExtension = file.originalname.split(".");
//     let fileName =
//       Math.random().toString(36).substring(2, 15) +
//       Math.random().toString(36).substring(2, 15) +
//       "." +
//       fileExtension[1];
//     return cb(null, `${fileName}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10000000,
//   },
// });

app.post("/api/v1/fileUpload", multer({storage: multer.memoryStorage()}).single("file"), async (req, res) => {
  var Fs = require("fs");
  if (!req.file) {
    return res
      .status(400)
      .send('File not supplied. Input text name for File should be "profile"');
  }

  if (req.file) {
    // var file = req.file.path;
    // console.log(file);
    // var fileStream = Fs.createReadStream(file);
    // var fileStat = Fs.stat(file, async function (err, stats) {
    //   if (err) {
    //     console.log(err);
    //   }
    let originalName = req.file.originalname.split(".")
    let fileName =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      "." +
      originalName[1]
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(`${fileName}`, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data != null) {
        // Fs.unlink(req.file.path, function (err) {
        //   if (err) console.log(err);
        //   console.log("file deleted successfully");
        // });
        res.end(fileName);
      } else {
        res
          .status(401)
          .send("Unable to upload file.Please try after some time.");
      }
    // });
  }
});
const PORT = process.env.SERVER_PORT || 3000
app.listen(PORT, () => {
  console.log("Listening at http://localhost:" + PORT);
});
