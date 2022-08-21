const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const multer = require("multer");
var app = express();
app.use(cors());

let { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://pkeosknanvmwrrmirmim.supabase.co";

const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const storage = multer.diskStorage({
  destination: "./",
  filename: (req, file, cb) => {
    let fileExtension = file.originalname.split(".");
    let fileName =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      "." +
      fileExtension[1];
    return cb(null, `${fileName}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000,
  },
});

app.post("/api/v1/fileUpload", upload.single("file"), async (req, res) => {
  var Fs = require("fs");
  if (!req.file) {
    return res
      .status(400)
      .send('File not supplied. Input text name for File should be "profile"');
  }

  if (req.file) {
    var file = req.file.path;
    console.log(file);
    var fileStream = Fs.createReadStream(file);
    var fileStat = Fs.stat(file, async function (err, stats) {
      if (err) {
        console.log(err);
      }
      const { data, error } = await supabase.storage
        .from(process.env.BUCKET_NAME)
        .upload(`${file}`, fileStream, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data != null) {
        Fs.unlink(req.file.path, function (err) {
          if (err) console.log(err);
          console.log("file deleted successfully");
        });
        res.end(req.file.filename);
      } else {
        res
          .status(401)
          .send("Unable to upload file.Please try after some time.");
      }
    });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Listening at http://localhost:" + process.env.SERVER_PORT);
});
