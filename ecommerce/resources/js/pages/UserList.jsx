import React from 'react';

const UserList = ({ users = [] }) => {
  return (
    <div>
      <h2>Felhasználók listája</h2>
      <ul>
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))
        ) : (
          <p>Nincsenek elérhető felhasználók.</p>
        )}
      </ul>
    </div>
  );
};

export default UserList;
