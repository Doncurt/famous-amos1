const express = require('express');
const router = express.Router();

let pets = require('../json/pets')
let comments = require('../json/comments')

const model = require('../db/models/');
const Pet = require('../db/models/');


// UPLOADING TO AWS S3
const multer  = require('multer');
//sets up the multur storage for uploads locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      // TODO Look into edge cases
      let extArray = file.mimetype.split("/");
      let ext = extArray[extArray.length - 1];
      cb(null, Date.now() + "." + ext);
  }
});

//multer grabs the storage
const upload = multer({ storage });
const Upload = require('s3-uploader');
//client started for s3 that handles the initialization for the S3_BUCKET and immige types


var client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'pets/coverImg/',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    versions: true,
    original: true
  },
  versions: [{
    maxWidth: 320,
    aspect: '1.618:1',
    suffix: '-thumbnail'
  },{
    maxWidth: 1000,
    aspect: '2.414:1', //silver ratio
    suffix: '-desktop'
  },{
    maxWidth: 320,
    aspect: '2.414:1', //silver ratio
    suffix: '-mobile'
  },{
    maxWidth: 100,
    aspect: '1:1',
    suffix: '-square'
  }]
});




// NEW
router.get('/new', (req, res) => {
  req.flash('info', 'Flash message ');
  res.render('pets-new');
});


// SHOW
router.get('/:petId', (req, res) => {
  model.Pet.findById(req.params.petId, {
      include: {
          model: model.Comment,
      },
      order: [
          [ model.Comment, 'id', 'DESC']
      ]
  }).then(pet => {
      res.render('pets-show', { pet });
  });
});

// CREATE
router.post('/', (req, res) => {
    model.Pet.create(req.body).then(() => {
      console.log(req.body);
        req.flash('success', 'Successfully Created pets')
        res.redirect('/');
    })
});

// EDIT
router.get('/:petId/edit', (req, res) => {
    model.Pet.findById(req.params.petId).then(pet => {
        res.render('pets-edit', { pet });
    });
});

// UPDATE
router.put('/:petId', (req, res) => {
    model.Pet.findById(req.params.petId).then(pet => {
        return pet.update(req.body);
    }).then(() => {
        res.redirect(`/pets/${req.params.petId}`);
    }).catch((err) => {
        res.send(err);
    });
});


// DESTROY
router.delete('/:petId', (req, res) => {
  model.Pet.findById(req.params.petId).then(pet => {
      return pet.destroy();
  }).then(() => {
      res.redirect('/');
  }).catch((err) => {
      res.send(err);
  });
});
module.exports = router;
