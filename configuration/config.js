const mongoose = require("mongoose");

const dotenv = require("dotenv")
// if()

const result =  dotenv.config({path:'./config.env'});
// console.log(result.parsed);
let url = process.env.DB_CONNECTION;
console.log('db url', url);
// let url =  "mongodb://localhost:27017/product_data"

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

module.exports = function () {
    mongoose.connect(url, options);
    const db = mongoose.connection;
    mongoose.Promise = global.Promise;

    db.on("error", function (err) {
        console.log("error");
    });

    db.once("open", function () {
        console.log("connected");
        //console.log(db);
    });

    process.on("SIGINT", function () {
        mongoose.connection.close(function () {
            console.log(
                "Mongoose default connection is disconnected due to application termination"
            );
            process.exit(0);
        });
    });
};

//module.exports = {mongoose};
