const ErrorResponse = require('../utils/error_response');
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
  
  const bootcamps = await Bootcamp.find();
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