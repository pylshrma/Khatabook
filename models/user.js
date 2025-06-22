const mongoose = require('mongoose');

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB Atlas");
})
.catch((err) => {
    console.log("❌ Connection error:", err);
});

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    khatas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'khata' }]
});

module.exports = mongoose.model("user", userSchema);

