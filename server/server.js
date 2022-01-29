var vars = require("./vars")

var cors = require('cors')
const express = require('express')
const mongoose = require('mongoose');
const { Schema } = mongoose;
var FormData = require('form-data');
var fs = require('fs');
var multer = require('multer')
var bodyParser = require('body-parser')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, vars.UPLOADS_FOLDER)
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
const app = express()

app.use(cors())
app.use(bodyParser.json())

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
  await mongoose.connect(vars.MONGO_URL);
}

app.post('/uploadFile', upload.single('file'), (req, res) => {
  const file = req.file
  if (!file) {
    const error = new Error('Errore nel caricamento')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log(file)
  insertFile(file.fieldname, 0, "", file.originalname, file.size, file.mimetype)
  res.status(200).send({ res: "File caricato" })
})

app.get("/downloadFile/:_id", (req, res) => {
  let id = mongoose.Types.ObjectId(req.params._id)
  FileModel.findById(id, function (err, data) {
    console.log(id)
    console.log(data)
    res.set("Access-Control-Expose-Headers","*")
    res.download(vars.UPLOADS_FOLDER + "/" + data.fileName ,data.fileName);//+ "." + data.extension
  })
  
})

app.delete("/deleteFile/:_id", (req, res) => {
  FileModel.deleteOne({ _id: req.params._id }).then(function () {
    res.status(200).send({ res: "File eliminato" })
  }).catch(function (error) {
    res.status(500).send({ res: "Errore" })
  });
})

app.get("/getFiles", (req, res) => {
  FileModel.find({ id: 0 }, function (err, data) {
    if (err) {
      console.log(err);
      return
    }
    if (data.length == 0) {
      res.status(200).send([])
      return
    }
    res.status(200).send(data)
  })

})

app.listen(vars.NODE_PORT, () => {
  console.log("Server listening on port " + vars.NODE_PORT)
  mongoConnect()
  if (!fs.existsSync(vars.UPLOADS_FOLDER)) {
    fs.mkdirSync(vars.UPLOADS_FOLDER);
  }
})