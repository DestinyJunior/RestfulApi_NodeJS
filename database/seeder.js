const fs = require('fs');
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const env = require('dotenv');


// Load env
env.config({ path: './config/.env' });

// Load models
const Bootcamp = require('../models/Bootcamp');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read Json file

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/bootcamps.json`, 'utf-8')
);

// Import data to database
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
      
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
      
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (e) {
    console.error(e);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}