const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Religion} = require('./models');

router.get("/new", (req, res) => {
  res.render("newReligion")
});

router.get('/', (req, res) => {
  Religion
    .find()
    .then(religion => {
      const religions = religion.map(religion => religion.apiRepr());
      res.render("religions", {religions, hi:"Hi world!"});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

router.get('/:id', (req, res) => {
  Religion
    .findById(req.params.id)
    .then(religion => {
      res.render("religionDetail", {religion:religion.apiRepr()})
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went horribly awry'});
    });
});

// add endpoint for POST requests, which should cause a new
// blog post to be added (using `BlogPosts.create()`). It should
// return a JSON object representing the new post (including
// the id, which `BlogPosts` will create. This endpoint should
// send a 400 error if the post doesn't contain
// `title`, `content`, and `author`
router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'historicalRoots', 'basicBeliefs', 
                          'practices', 'organization', 'books'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  //req.body instead of all required fields
  const item = Religion.create(req.body)
    .then(religion => {
      const apiRepr = religion.apiRepr() 
      const resObject = Object.assign({}, apiRepr)
      resObject.id = religion.id

      console.log(JSON.stringify(resObject))

      // console.log(JSON.stringify(apiRepr))
      res.status(201).json(resObject)
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

router.delete('/:id', (req, res) => {
  Religion
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});


router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['name', 'historicalRoots', 'basicBeliefs', 
                          'practices', 'organization', 'books'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Religion
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

router.delete('/:id', (req, res) => {
  Religion
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.ID}\``);
      res.status(204).end();
    });
});

router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});


module.exports = router;
