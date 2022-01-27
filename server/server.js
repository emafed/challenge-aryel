var env = require("./env")

var cors = require('cors')
const express = require('express')
const mongoose = require('mongoose');
const { Schema } = mongoose;
var FormData = require('form-data');
var fs = require('fs');
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
const app = express()
app.use(cors())

const FileCollection = new Schema({
  type: String,
  level: Number,
  parentId: String,
  fileName: String,
  originalFileName: String,
  size: Number,
  extension: String,
  mime: String,
  loadDate: { type: Date, default: Date.now },
  modDate: { type: Date, default: Date.now }
});

const FileModel = mongoose.model('FileModel', FileCollection);


async function insertFile(type, level, parentId, fileName, size, mime) {
  var extension = fileName.split(".").pop();
  const f = new FileModel({
    type: type,
    level: level,
    parentId: parentId,
    fileName: fileName,
    originalFileName: fileName,
    size: size,
    extension: extension,
    mime: mime
  });
  await f.save()
}


async function mongoConnect() {
  await mongoose.connect(env.MONGO_URL);
}

app.post('/uploadFile', upload.single('file'), (req, res) => {
  const file = req.file
  if (!file) {
    const error = new Error('Errore nel caricamento')
    error.httpStatusCode = 400
    return next(error)
  }
  insertFile(file.fieldname, 0, "", file.originalname, file.size, file.mime)
  res.status(200).send({ res: "File caricato" })
})

app.get("/downloadFile", (req, res) => {
  res.download("uploads/WIN_20220122_10_15_53_Pro.mp4");
})

app.get("/getFiles", (req, res) => {
  FileModel.find({ id:0 }, function (err, data) {
    if (err) {
      console.log(err);
      return
    }
    if (data.length == 0) {
      res.status(200).send({res: "No record found"})
      return
    }
    res.status(200).send(data)
  })

})

app.listen(env.NODE_PORT, () => {
  console.log("Server listening on port " + env.NODE_PORT)
  mongoConnect()
})