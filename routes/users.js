const express = require('express');
const db = require('../data/helpers/userDb');

const router = express.Router();

function capitalizeUserName(req, res, next) {
  const { name } = req.body;
  req.body.name = name.charAt(0).toUpperCase() + name.slice(1);
  next();
}

router.get('/', async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The users information could not be retrieved.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.getById(id);
    if (!user) {
      res.status(404).json({ message: 'The user with the specified ID does not exist.' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The user information could not be retrieved.' });
  }
});

router.get('/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.getById(id);
    if (!user) {
      res.status(404).json({ message: 'The user with the specified ID does not exist.' });
    } else {
      const posts = await db.getUserPosts(id);
      res.status(200).json(posts);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The user's posts could not be retrieved." });
  }
});

router.post('/', capitalizeUserName, async (req, res) => {
  try {
    const { body: user } = req;
    if (!user.name) {
      res.status(400).json({ errorMessage: 'Please provide name for the user.' });
    } else {
      const newUser = await db.insert(user);
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'There was an error while saving the user to the database' });
  }
});

router.put('/:id', capitalizeUserName, async (req, res) => {
  try {
    const { id } = req.params;
    const { body: userUpdates } = req;
    if (!userUpdates.name) {
      res.status(400).json({ errorMessage: 'Please provide name for the user.' });
    } else {
      const updatedCount = await db.update(id, userUpdates);
      if (!updatedCount) {
        res.status(404).json({ message: 'The user with the specified ID does not exist.' });
      } else {
        const updatedUser = await db.getById(id);
        res.status(200).json(updatedUser);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The user information could not be modified.' });
  }
});

// breaks when attempting to delete a user that has posts
// [Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed] errno: 19, code: 'SQLITE_CONSTRAINT'
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.getById(id);
    console.log(user);
    if (!user) {
      res.status(404).json({ message: 'The user with the specified ID does not exist.' });
    } else {
      await db.remove(id);
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The user could not be removed' });
  }
});

module.exports = router;
