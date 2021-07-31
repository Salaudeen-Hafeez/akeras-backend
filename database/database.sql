CREATE TABLE users(
    users_id SERIAL PRIMARY KEY,
    _name VARCHAR(50) NOT NULL,
    _username VARCHAR(30) UNIQUE NOT NULL,
    _email VARCHAR(100) UNIQUE NOT NULL,
    _password VARCHAR(255) NOT NULL,
    _status VARCHAR(30) NOT NULL
);

CREATE TABLE admins(
    users_id SERIAL PRIMARY KEY,
    _name VARCHAR(50) NOT NULL,
    _username VARCHAR(30) UNIQUE NOT NULL,
    _email VARCHAR(100) UNIQUE NOT NULL,
    _password VARCHAR(255) NOT NULL,
    _status VARCHAR(30) NOT NULL
);

CREATE TABLE packages(
    parcel_id SERIAL PRIMARY KEY,
    _username VARCHAR(30) NOT NULL,
    _name VARCHAR(50) NOT NULL,
    _location VARCHAR(60) NOT NULL,
    _destination VARCHAR(60) NOT NULL,
    _sender VARCHAR(60) NOT NULL,
    _reciever VARCHAR(60) NOT NULL,
    _frajile VARCHAR(60) NOT NULL,
    _status VARCHAR(30) NOT NULL
);