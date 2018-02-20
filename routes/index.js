const express = require('express');
const router = express.Router();
const model = require('../db/models/');
const pets = require('../json/pets');

//INDEX GET ROUTE



/* GET home page. */
// TODO - Flash Messages on error messages
router.get('/', (req, res) => {
    let limit = 3;   // number of records per page
    let offset = 0;
    let searchQuery = {};

    // If you have a search query, actually do something
    if(req.query.search){
        searchQuery = {
            $or: [ { name: { $iLike: "%" + req.query.search + "%" } },
			       { species: { $iLike: "%" + req.query.search + "%" } },
                   { description: { $iLike: "%" + req.query.search + "%" } },
                ]
            };
    }

    model.Pet.findAndCountAll({where: searchQuery}).then((data) => {
      let page = req.query.page;      // page number
      let pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);

      model.Pet.findAll({
        where: searchQuery,
        limit: limit,
        offset: offset,
        $sort: { id: 1 }
      }).then((pets) => {
          res.render('pets-index', {pets, count: data.count, search: req.query.search, pages});
      });
    })
    .catch(function (error) {
  		res.status(500).send('Internal Server Error');
  	});

});



module.exports = router;
