import jwt from 'jsonwebtoken';
import { loginValidation } from './reqbodyauth';
import { client } from '../database/db';

const { verify } = jwt;

/* Login authentication. First validate the user login credentials
using loginValidation function. Then check if the user exist. if 
all the check pass run the next() function */
const verifyLogin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const userExist = await client.query(
      `SELECT EXISTS(SELECT 1 FROM users WHERE _email = $1)`,
      [email]
    );
    if (!userExist.rows[0].exists) {
      throw new Error(`Invalid email address or password`);
    }
    next();
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
};

/* Login authentication middle ware. First validate the admin 
login credentials using loginValidation function. Then check if 
the admin exist. if all the check pass run the next() function */
const verifyAdminLogin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const adminExist = await client.query(
      `SELECT EXISTS(SELECT 1 FROM admins WHERE _email = $1)`,
      [email]
    );
    if (!adminExist.rows[0].exists) {
      throw new Error(`Invalid email address or password`);
    }
    next();
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
};

/* Verify token middle ware. First check if the user is admin,
if the user is admin then verify the admin token otherwise 
verify the user token */
const verifyUserToken = (req, res, next) => {
  const { token, email, username } = req.params;
  if (!token && !(email || username)) {
    throw new Error('Access denied');
  } else {
    try {
      verify(token, 'jfgdjdgkfgerg');
      next();
    } catch (error) {
      res.status(400).json({ errMessage: 'Invalid token' });
    }
  }
};

const verifyAdminToken = (req, res, next) => {
  const { token, email, username } = req.params;
  if (!token && !(email || username)) {
    throw new Error('Access denied');
  } else {
    try {
      verify(token, 'jfgdjdgSenditadminkfgerg');
      next();
    } catch (error) {
      res.status(400).json({ errMessage: 'Invalid token' });
    }
  }
};

const verifyToken = (req, res, next) => {
  const { token, email, username } = req.params;
  if (!token && !(email || username)) {
    throw new Error('Access denied');
  } else {
    try {
      if (email.includes('@sendit.com')) {
        verify(token, 'jfgdjdgSenditadminkfgerg');
        next();
      } else {
        verify(token, 'jfgdjdgkfgerg');
        next();
      }
    } catch (error) {
      res.status(400).json({ errMessage: 'Invalid token' });
    }
  }
};

const _verifyLogin = verifyLogin;
export { _verifyLogin as verifyLogin };
const _verifyAdminLogin = verifyAdminLogin;
export { _verifyAdminLogin as verifyAdminLogin };
const _verifyUserToken = verifyUserToken;
export { _verifyUserToken as verifyUserToken };
const _verifyAdminToken = verifyAdminToken;
export { _verifyAdminToken as verifyAdminToken };
const _verifyToken = verifyToken;
export { _verifyToken as verifyToken };
