const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://khatabook:khata123@khatabookdb.beppqbg.mongodb.net/khataDB?retryWrites=true&w=majority&appName=KhatabookDB`, {
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

