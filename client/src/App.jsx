import React from 'react';
import { Router } from '@reach/router';
import './App.css';
import useResource from './hooks/useResource';
import UsersList from './components/UsersList';
import UserPosts from './components/UserPosts';

const App = () => {
  const userStore = useResource('http://localhost:4000/api/users');

  return (
    <main>
      <Router>
        <UsersList path="/" userStore={userStore} />
        <UserPosts path="/:userId" userStore={userStore} />
      </Router>
    </main>
  );
};

export default App;
