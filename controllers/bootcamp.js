const ErrorResponse = require('../utils/error_response');
const Bootcamp = require('../models/Bootcamp');

/**
 * Get all BootCamps -- GET /api/v1/bootcamps
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access Public
 */
exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (e) {
    res.status(400).json({success: false, msg: 'An Error Occurred'});
  }
};


/**
 * Get Single BootCamp by ID -- GET /api/v1/bootcamps/:id
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access Public
 */
exports.getBootCamp = async (req, res, next) => {
  try { 
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
    //   return res.status(400).json({success: false});
      return next(new ErrorResponse(`Bootcamp Not Found With Id of ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootcamp });
  } catch (e) {
    // res.status(400).json({success: false, msg: 'An Error Occurred'});
    next(new ErrorResponse(`Bootcamp Not Found With Id of ${req.params.id}`, 404));
  }

};

/**
 * Create Single BootCamp by ID -- Post /api/v1/bootcamps
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access authenticate
 */
exports.createBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    
    res.status(201).json({
      success: true,
      msg: 'Create BootCamp',
      data: bootcamp
    }); 
  } catch (e) {
    //   error handler
    res.status(400).json({success: false, msg: 'An Error Occurred'});
  }
 
};

/**
 * Update Single BootCamp by ID -- Update /api/v1/bootcamps/:id
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access authenticate
 */
exports.updateBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!bootcamp) {
      return res.status(400).json({success: false});
    }
    
    res.status(200).json({success: true, msg: 'Update BootCamp', data: bootcamp});
  } catch (e) {
    res.status(400).json({success: false});
  }

};

/**
 * Delete Single BootCamp by ID -- DELETE /api/v1/bootcamps/:id
 * @param  req request
 * @param  res reponse
 * @param  next  for middleware
 * @access authenticate
 */
exports.deleteBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
    if (!bootcamp) {
      return res.status(400).json({success: false});
    }
    
    res.status(200).json({success: true, msg: 'Deleted BootCamp', data: bootcamp});
  } catch (e) {
    res.status(400).json({success: false});
  }

};