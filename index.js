const express = require('express');
const server = express();
const cors = require('cors');

const posts = require('./routes/posts');
const users = require('./routes/users');

server.use(express.json());
server.use(cors());

server.use('/api/posts', posts);
server.use('/api/users', users);

const port = 4000;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
