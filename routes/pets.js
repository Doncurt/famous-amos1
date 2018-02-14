const express = require('express');
const router = express.Router();

let pets = require('../json/pets')
let comments = require('../json/comments')

const model = require('../db/models/');
const Pet = require('../db/models/');


// UPLOADING TO AWS S3
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var Upload = require('s3-uploader');

var client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'posts/coverImg/',
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




router.get('/search', (req, res) => {
    let limit = 3;   // number of records per page
    let offset = 0;
    let termQuery = {};

    if(req.query.term) {
        termQuery = {
            $or: [ { name: { $iLike: "%" + req.query.term + "%" } },
			       { species: { $iLike: "%" + req.query.term + "%" } },
                   { description: { $iLike: "%" + req.query.term + "%" } },
                ]
            };
    }

    model.Pet.findAndCountAll({where: termQuery}).then((data) => {
      let page = req.query.page;      // page number
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);

      model.Pet.findAll({
        where: termQuery,
        limit: limit,
        offset: offset,
        $sort: { id: 1 }
      }).then((pets) => {
          res.render('pets-index', {pets, count: data.count, term: req.query.term, pages});
      });
    })
    .catch(function (error) {
  		res.status(500).send('Internal Server Error');
  	});

});

// INDEX
router.get('/', (req, res) => {
  //Uses PET model to  find all the pet uobjects then posts
    Pet.findAll().then(pets =>
      {res.send(pets) });

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
router.post('/', upload.single('picUrl'), (req, res) => {
    model.Pet.create(req.body);
    res.redirect('/');
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
  res.redirect('/');
});

module.exports = router;
