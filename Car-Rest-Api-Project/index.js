const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app = express();

//Connect to mongoDb
mongoose.connect('mongodb://localhost:27017/RestApiData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongodb Connected Successfully...'))
    .catch(err => console.log(err))

//Body-parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//Middlewares
app.use(logger('dev'));


//Bring all routes
const users = require('./routes/users');
const cars = require('./routes/cars');

//Routes
app.use('/users', users);
app.use('/cars', cars);

//Ctach 404 Errors and forward them to error handler
// app.use((req, res, next) => {
//     const err = new Error('Not found');
//     err.status = 404;
//     next(err);
// })


// //Error handler function
// app.use((err, req, res, next) =>{
//     const error = app.get('env') === 'development' ? err:{};
//     const status = err.status || 500;

//     //Response to client
//     res.status(status).json({
//         error:{
//             message: error.message
//         }
//     })

//     //Response to ourselves
//     console.error(err)

// })


//Start the server
const port  = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));



