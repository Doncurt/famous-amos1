const express = require('express');
const router = express.Router({mergeParams: true});

let comments = require('../json/comments')
const model = require('../db/models/');
// CREATE
router.post('/pets/:petId/comments', (req, res) => {
    model.Comment.create({
        content: req.body.content,
        PetId: req.params.petId
    }).then(() => {
        res.redirect(`/pets/${req.params.petId}`);
    }).catch((err) => {
        res.redirect(`/pets/${req.params.petId}`);
    });
});

//SHOW



// DESTROY
router.delete('/:index', (req, res) => {
    res.redirect(`/pets/${req.params.id}`);

});


module.exports = router;
