import React from 'react';
import { Link } from '@reach/router';
import useResource from '../hooks/useResource';

const UserPosts = ({ userId, userStore }) => {
  const { state: users } = userStore;
  const user = users.find(u => u.id === Number(userId));

  const endpoint = `http://localhost:4000/api/users/${userId}/posts`;
  const postsStore = useResource(endpoint);

  const renderUserPosts = () => {
    // there is a lot of state to account for here, I would probably do this differently in the future
    if (userStore.isLoading || postsStore.isLoading) return <div>Loading...</div>;

    if (!user && !userStore.isLoading) return <div>Invalid user ID</div>;

    if (user && !postsStore.state.length) return <div>No posts for user</div>;

    return (
      <div>
        <h1>{user.name}'s posts</h1>
        <div className="posts-list">
          {postsStore.state.map(p => (
            <div key={p.id}>
              <h2>Post #{p.id}</h2>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Link to="/">Back to users list</Link>
      {renderUserPosts()}
    </div>
  );
};

export default UserPosts;
