var cors = require('cors')
const mongoose = require('mongoose');
const express = require('express')
const app = express()
app.use(cors({origin: '*'}))
const port = 3000
var FormData = require('form-data');
var fs = require('fs');
 

const { Schema } = mongoose;

const blogSchema = new Schema({
  title:  String, // String is shorthand for {type: String}
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});



async function mongoConnect() {
  await mongoose.connect('mongodb://localhost:27017/test');
}

app.post('/', (req, res) => {
  console.log(req)
  var form = new FormData();
  form.append('my_file', fs.createReadStream('/foo/bar.jpg'));
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  mongoConnect()
})