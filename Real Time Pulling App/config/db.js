const mongoose = require('mongoose');
const key = 'mongodb+srv://amit-singh_1:9576435668@cluster0-49vnb.mongodb.net/test?retryWrites=true'
mongoose.connect(key, { useUnifiedTopology: true, useNewUrlParser: true  })
.then(() => console.log('MongoDb Connected Successfully..'))
.catch(err => console.log(err));