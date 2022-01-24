const mongoose = require('mongoose');
const express = require('express')
const app = express()
const port = 3000

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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  this.mongoConnect()
})