var cors = require('cors')
const express = require('express')
const mongoose = require('mongoose');
const { Schema } = mongoose;
var FormData = require('form-data');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const app = express()
app.use(cors())
const port = 3000
const dataSchema = new Schema({root: Object}, { collection: 'root' });
const Root = mongoose.model('root', dataSchema);


async function createRootDocument(){
  const rootDocument = new Root({ root: {} });
  await rootDocument.save()
}


async function mongoConnect() {
  // crea il "db" se non esiste
  await mongoose.connect('mongodb://localhost:27017/db');
}

app.post('/uploadFile', upload.single('file'), (req, res) => {
  console.log(req.file.path)
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  mongoConnect()
  //createRootDocument()
})