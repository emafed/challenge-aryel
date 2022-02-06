var vars = require("./vars")

var cors = require('cors')
const express = require('express')
const mongoose = require('mongoose');
const { Schema } = mongoose;
var FormData = require('form-data');
var fs = require('fs');
var multer = require('multer')
var bodyParser = require('body-parser');
const { path } = require("express/lib/application");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, vars.UPLOADS_FOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, String(Math.floor(Date.now() / 1000)))
  }
})

var upload = multer({ storage: storage })
const app = express()

app.use(cors())
app.use(bodyParser.json())

const FileCollection = new Schema({
  order: Number,
  parentId: String,
  path: String,
  fileName: String,
  originalFileName: String,
  size: Number,
  extension: String,
  mime: String,
  loadDate: { type: Date, default: Date.now },
  modDate: { type: Date, default: Date.now }
});

const FileModel = mongoose.model('FileModel', FileCollection);


async function insertFile(parentId, fileName, size, mime, path) {
  var extension = (mime != "") ? fileName.split(".").pop() : "";
  var order = (mime != "") ? 0 : 1; // 1 folder 0 file
  const f = new FileModel({
    order: order,
    parentId: parentId,
    path: path,
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

app.post('/uploadFile/:_parentId?', upload.single('file'), (req, res) => {
  let parentId = (req.params._parentId != 'undefined') ? req.params._parentId : "";
  const file = req.file
  if (!file) {
    const error = new Error('Errore nel caricamento')
    error.httpStatusCode = 400
    return next(error)
  }
  insertFile(parentId, file.originalname, file.size, file.mimetype, file.filename)
  res.status(200).send({ res: "File caricato" })
})

app.get('/createFolder/:_folderName/:_parentId?', (req, res) => {
  let parentId = (req.params._parentId != 'undefined') ? req.params._parentId : "";
  insertFile(parentId, req.params._folderName, 0, "", "");
  res.status(200).send({ res: "File caricato" });
})

app.get("/downloadFile/:_id", (req, res) => {
  let id = mongoose.Types.ObjectId(req.params._id)
  FileModel.findById(id, function (err, data) {
    res.set("Access-Control-Expose-Headers", "*");
    res.download(vars.UPLOADS_FOLDER + "/" + data.path, data.fileName);
  })
})

app.delete("/deleteFile/:_id", (req, res) => {
  FileModel.findOneAndDelete({ _id: req.params._id }).then(function (data) {
    if (data.path != "") {
      fs.unlinkSync(vars.UPLOADS_FOLDER + "/" + data.path);
    }
    res.status(200).send({ res: "File eliminato" });
  }).catch(function (error) {
    res.status(500).send({ res: "Errore" });
  });
})

app.get("/getFiles/:_id?", (req, res) => {
  let qry = (req.params._id != undefined) ? ({ parentId: req.params._id }) : ({ parentId: "" })
  FileModel.find(qry).sort({ order: -1, modDate: 1 }).exec(function (err, data) {
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