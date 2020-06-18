const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//  DB Config
require('./config/db');

//  Set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

const poll = require('./routes/poll');
app.use('/poll', poll)

const port = 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));