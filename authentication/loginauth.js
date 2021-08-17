import jwt from 'jsonwebtoken';
import { loginValidation } from './reqbodyauth';
import { client } from '../database/db';

const { verify } = jwt;
const verifyLogin = async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { email } = req.body;
  try {
    const userExist = await client.query(
      `SELECT EXISTS(SELECT 1 FROM users WHERE _email = $1)`,
      [email]
    );
    if (!userExist.rows[0].exists) {
      throw new Error(`user with ${email} does not exist`);
    }
    next();
  } catch (error) {
    res.status(400).json({ email: error.message });
  }
};

const verifyAdminLogin = async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const { email } = req.body;
  try {
    const adminExist = await client.query(
      `SELECT EXISTS(SELECT 1 FROM admins WHERE _email = $1)`,
      [email]
    );
    if (!adminExist.rows[0].exists) {
      throw new Error(`admin with ${email} does not exist`);
    }
    next();
  } catch (error) {
    res.status(400).json({ email: error.message });
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
      res.status(400).json({ auth_token: 'Invalid token. kindly login again' });
    }
  }
};

const _verifyLogin = verifyLogin;
export { _verifyLogin as verifyLogin };
const _verifyAdminLogin = verifyAdminLogin;
export { _verifyAdminLogin as verifyAdminLogin };
const _verifyToken = verifyToken;
export { _verifyToken as verifyToken };
