var mongoose = require('mongoose');
var mongoURI = require('./keys').MongoURI;

// Connect to DB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

const connection = mongoose.connection;


module.exports = { conn: connection };

