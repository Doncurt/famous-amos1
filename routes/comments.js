const express = require('express');
const router = express.Router({mergeParams: true});

const comments = require('../json/comments')
const model = require('../db/models/');
let commentJSON = require('../json/comments');


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
router.delete('/:index', (req, res, next) => {

    model.Comment.destroy({
        where: {

            id: req.params.index
        }

    }).then(() => {
        res.redirect(`/pets/${req.params.petId}`);
    }).catch((err) => {
        res.redirect(`/pets/${req.params.petId}`);
    });

});
// SHOW
router.get('/comment-populate', (req, res) => {
    const Pet = model.Pet;
    const Comment = model.Comment;

    Comment.sync().then(function(){
        // Just add ALL of the comments, man.
        commentJSON.forEach(function(content){
            content.PetId = req.params.petId;
            comment.create(content);
        });
    }).then(() => {
        res.send("Population successful.");
    }).catch((err) => {
        res.send(err);
    });

});



module.exports = router;
