const mongoose = require("mongoose");

const khataSchema = mongoose.Schema(
  {
    title: String,
    details: String,
    isEncoded:{
      type:String,
      default:"off"
    },
    password: String,
    shareable:
    {
      type:String,
      default:"off"
    },
    date:{
        type:Date,
        default:Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("khata", khataSchema);
