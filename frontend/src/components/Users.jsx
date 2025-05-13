import React from "react";
import { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.log("Error Fetching Users", error);
      });
  }, []);

  console.log(Users);
  return (
    <>
      <div>
        <h3>Users (Array of objects):</h3>
        <ul>
          {users.map((user) => {
            return (
              <li key={user.id}>
                <h4>Name: {user?.name}</h4>
                <p>Email: {user?.email}</p>
                <h4>Address Details</h4>
                <address>
                <p>Street : {user?.address?.street}</p>
                <p>City : {user?.address?.city}</p>
                <p>latitude:{user?.address?.geo?.lat}</p>
                <p>langitude:{user?.address?.geo?.lng}</p>
                </address>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Users;
