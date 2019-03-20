const express = require('express');
const db = require('../data/helpers/postDb');

const router = express.Router();

const isValidPost = post => {
  return post.text && post.user_id;
};

router.get('/', async (req, res) => {
  try {
    const posts = await db.get();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The posts information could not be retrieved.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.getById(id);
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The post information could not be retrieved.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { body: post } = req;
    if (!isValidPost(post)) {
      res.status(400).json({ errorMessage: 'Please provide text and user_id for the post.' });
    } else {
      const { id: newPostId } = await db.insert(post);
      const newPost = await db.getById(newPostId);
      res.status(201).json(newPost);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'There was an error while saving the post to the database' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body: postUpdates } = req;
    if (!isValidPost(postUpdates)) {
      res.status(400).json({ errorMessage: 'Please provide text and user_id for the post.' });
    } else {
      const updatedCount = await db.update(id, postUpdates);
      if (!updatedCount) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        const updatedPost = await db.getById(id);
        res.status(200).json(updatedPost);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The post information could not be modified.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.getById(id);
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist.' });
    } else {
      await db.remove(id);
      res.status(200).json(post);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'The post could not be removed' });
  }
});

module.exports = router;
