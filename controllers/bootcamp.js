const ErrorResponse = require('../utils/error_response');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async'); //async handler

const Bootcamp = require('../models/Bootcamp');


/**
 * Get all BootCamps -- GET /api/v1/bootcamps
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access Public
 */
exports.getBootCamps = asyncHandler( async(req, res, next) => {
  // console.log(req.query);
  let query;

  const reqQuery = { ...req.query };


  // fields to exclude
  const removeFields = ['select'];

  // create query string
  let queryStr = JSON.stringify(reqQuery);


  // loop over removeFields and delete them from reqQuery
  
  removeFields.forEach(param => delete reqQuery[param]);

  // using lt (less than), gte (greater than or equals to), 
  //lte(less than or equals to), gt(greater than), in (contains)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // console.log(queryStr);
  query = Bootcamp.find(JSON.parse(queryStr));

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  const bootcamps = await query;

  res.status(200).json(
    {
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  
});


/**
 * Get Single BootCamp by ID -- GET /api/v1/bootcamps/:id
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access Public
 */
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    //   return res.status(400).json({success: false});
    return next(new ErrorResponse(`Bootcamp Not Found With Id of ${req.params.id}`, 404));
  }
  res.status(200).json({success: true, data: bootcamp });

});

/**
 * Create Single BootCamp by ID -- Post /api/v1/bootcamps
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access authenticate
 */
exports.createBootCamp = asyncHandler(async (req, res, next) => { 
  const bootcamp = await Bootcamp.create(req.body);
    
  res.status(201).json({
    success: true,
    msg: 'Create BootCamp',
    data: bootcamp
  }); 
 
});

/**
 * Update Single BootCamp by ID -- Update /api/v1/bootcamps/:id
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access authenticate
 */
exports.updateBootCamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
    
  if (!bootcamp) {
    // return res.status(400).json({success: false});
    return next(new ErrorResponse(`Bootcamp Not Found With Id of ${req.params.id}`, 404));

  }
    
  res.status(200).json({success: true, msg: 'Update BootCamp', data: bootcamp});
  

});

/**
 * Delete Single BootCamp by ID -- DELETE /api/v1/bootcamps/:id
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access authenticate
 */
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
  if (!bootcamp) {
    // return res.status(400).json({success: false});
    return next(new ErrorResponse(`Bootcamp Not Found With Id of ${req.params.id}`, 404));

  }
    
  res.status(200).json({success: true, msg: 'Deleted BootCamp', data: bootcamp});

});

/**
 * Get  BootCamps Within a Radius --  /api/v1/bootcamps/radius/:zipcode/distance
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access public
 */
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lat/lng from geo coder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // divide distance by radius of earth
  // Earth Radius = 3,963 miles / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {$geoWithin : {$centerSphere: [[lng,lat], radius]}}
  });

  res.status(200).json(
    {
      success: true,
      count: bootcamps.length,
      data: bootcamps
    }
  );
});

