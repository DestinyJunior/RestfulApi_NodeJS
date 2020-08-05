const express = require('express');
const router = express.Router();

const { getBootCamp, getBootCamps, createBootCamp, updateBootCamp, deleteBootCamp} = require('../controllers/bootcamp');

// use router.route to next request on same routes e.g create and get all bootcamps use '/'
router.route('/').get(getBootCamps).post(createBootCamp);

//routes with prefix '/:id'
router.route('/:id').get(getBootCamp).put(updateBootCamp).delete(deleteBootCamp);

module.exports = router;