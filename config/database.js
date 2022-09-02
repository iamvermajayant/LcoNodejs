const mongoose = require('mongoose');
//require('events').EventEmitter.prototype._maxListeners = 100;

const {MONGODB_URL} =  process.env


exports.connect = () =>{
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        console.log(`DB connection successful `)
    )
    .catch(err => {
        console.log(`DB connection failed: ${err.message}`)
        console.log(err);
        process.exit(1);
    });
}

