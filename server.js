const express = require('express');
const env = require('dotenv');
// const logger = require('./middleware/logger'); // custom logger
const morgan = require('morgan');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


  
// Load Env
env.config({ path: './config/.env' });

//Connect to DataBase
connectDB();

const app = express();

// Body requests parser
app.use(express.json());

// import routes files
const bootcamps = require('./routes/bootcamp');

//dev middle ware logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use(logger);

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

// middle ware error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & process
  server.close(() => process.exit(1));
});