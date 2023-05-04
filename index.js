const express = require('express')
var cors = require('cors')
const path = require('path')
const app = express();
const port = 5000;

app.use(cors());
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})

const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://farman:farmansk%40786@cluster0.w3vgqpz.mongodb.net/invaders0x1"

mongoose.connect(mongoURI, () => {
  console.log("Connected to Mongo Successfully");
})