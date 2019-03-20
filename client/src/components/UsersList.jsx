import React from 'react';
import { Link } from '@reach/router';

const UsersList = ({ userStore }) => {
  const { state, isLoading, error } = userStore;

  return (
    <div>
      <h1>Blogs</h1>
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {state.length ? (
        <div className="users-list">
          {state.map(u => (
            <div key={u.id}>
              <h2>{u.name}</h2>
              <p>
                <Link to={`/${u.id}`}>View {u.name}'s posts</Link>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>No users</div>
      )}
    </div>
  );
};

export default UsersList;
