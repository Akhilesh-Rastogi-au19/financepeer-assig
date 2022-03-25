const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const employeeSchema = new mongoose.Schema({
  username: String,
  name: String,
  projectname: String,
  salary: Number,
  designation: String,
});
employeeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Employee", employeeSchema);
