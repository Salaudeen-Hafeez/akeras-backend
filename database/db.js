// psql --host=ec2-35-171-250-21.compute-1.amazonaws.com --port=5432 --username=faisswttxzvcmk --password --dbname=daui5dqk3pkfe4
import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const getUser = (incomingUser) => {
  const key = Object.keys(incomingUser);
  const value = Object.values(incomingUser);
  const user = client.query(`SELECT * FROM users WHERE ${key[0]} = $1`, value);
  return user;
};

const getAdmin = (email) => {
  const admin = client.query(`SELECT * FROM admins WHERE _email = $1`, [email]);
  return admin;
};

const getPackage = (email) => {
  const parcel = client.query(`SELECT * FROM packages WHERE _username = $1`, [
    email,
  ]);
  return parcel;
};

const updateUser = (key, value, con) => {
  const user = client.query(
    `UPDATE users SET ${key} = $1 WHERE 
      _email = $2 RETURNING *`,
    [value, con]
  );
  return user;
};

const updatePackage = (key, value, con) => {
  const userpackage = client.query(
    `UPDATE packages SET ${key} = $1 WHERE 
      parcel_id = $2 RETURNING *`,
    [value, con]
  );
  return userpackage;
};

const postUser = (userData) => {
  const newUser = client.query(
    `INSERT INTO users(
        _name,
        _username,
        _email,
        _password,
        _status
        ) 
        VALUES ($1, $2, $3, $4, $5)  RETURNING *`,
    userData
  );
  return newUser;
};

const postAdmin = (adminData) => {
  const newAdmin = client.query(
    `INSERT INTO admins(
        _name,
        _username,
        _email,
        _password,
        _status
        ) 
        VALUES ($1, $2, $3, $4, $5)  RETURNING *`,
    adminData
  );
  return newAdmin;
};

const postPackage = (packageData) => {
  const newPackage = client.query(
    `INSERT INTO packages (
        _name,
        _location,
        _destination,
        _sender,
        _reciever,
        _frajile,
        _username,
        _status
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8
          ) RETURNING *`,
    packageData
  );
  return newPackage;
};

const deleteUser = (userData) => {
  const deletedUser = client.query(
    `DELETE FROM users WHERE _username = $1 OR 
       users_id = $2 RETURNING *`,
    userData
  );
  return deletedUser;
};

const deletePackage = (packageCon) => {
  const deletedPackage = client.query(
    `DELETE FROM packages WHERE _username = $1 AND 
       parcel_id = $2 RETURNING *`,
    packageCon
  );
  return deletedPackage;
};

const _client = client;
export { _client as client };
const _getUser = getUser;
export { _getUser as getUser };
const _getAdmin = getAdmin;
export { _getAdmin as getAdmin };
const _getPackage = getPackage;
export { _getPackage as getPackage };
const _postUser = postUser;
export { _postUser as postUser };
const _postAdmin = postAdmin;
export { _postAdmin as postAdmin };
const _postPackage = postPackage;
export { _postPackage as postPackage };
const _updateUser = updateUser;
export { _updateUser as updateUser };
const _updatePackage = updatePackage;
export { _updatePackage as updatePackage };
const _deleteUser = deleteUser;
export { _deleteUser as deleteUser };
const _deletePackage = deletePackage;
export { _deletePackage as deletePackage };
