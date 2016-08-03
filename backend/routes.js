var router = require('express').Router();
var four0four = require('./utils/404')();

// Mongoose import
var mongoose = require('../node_modules/mongoose');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/terrorAlerts', function (error) {
  if (error) {
    console.log(error);
  }
});

// Mongoose Schema definition
var Schema = mongoose.Schema;
var AlertSchema = new Schema({
  name: String,
  lat: String,
  lng: String,
  stare: String,
  timestamp: String
});

// Mongoose Model definition
var Alert = mongoose.model('alerts', AlertSchema);

router.get('/alerts', getAlerts);
router.post('/alerts', postAlert);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

function getAlerts(req, res, next) {
  Alert.find({}, function (err, docs) {
    res.json(docs);
  });
}

function postAlert(req, res, next) {
  var alert = new Alert(req.body);
  
  alert.save(function(err){
    if(err){
      return next(err);
    } else {
      res.json(alert);  
    }
  })

}
