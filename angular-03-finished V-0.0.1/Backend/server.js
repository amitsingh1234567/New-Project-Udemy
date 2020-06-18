const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
var cors = require('cors');
const app = express();
const key = 'mongodb+srv://amit-singh_1:9576435668@cluster0-49vnb.mongodb.net/node-angular?retryWrites=true'

//  Bring All Routes
const postsRoute = require('./api/posts');
const userRoute = require('./api/user');
mongoose.connect(key,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDb Connected to Server...'))
    .catch(err => console.log(err));

//   CORS
app.use(cors());
//  Body-Parser config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join('./images')));


//  Actual route
app.use('/api/posts', postsRoute);
app.use('/api/user', userRoute);

const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));