const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://amnfqabc_db_user:tpAbsY2Az8UfFPhI@namastenode2.5nmtwup.mongodb.net/devTinder");
}


module.exports = connectDB;

