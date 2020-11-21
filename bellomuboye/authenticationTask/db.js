const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://admin:TheBells2001@cluster0.ptie5.mongodb.net/authenticationTask?retryWrites=true&w=majority', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = dbConnect;