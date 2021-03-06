import { Router } from 'express';
import { client } from '../database/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  postUser,
  postAdmin,
  postPackage,
  getUser,
  getAdmin,
} from '../database/db';
import {
  verifyLogin,
  verifyUserToken,
  verifyAdminLogin,
} from '../authentication/loginauth';
import {
  userValidation,
  parcelValidation,
} from '../authentication/reqbodyauth';

const postRouter = Router();
const { compare } = bcrypt;
const { sign } = jwt;

/* User login, first verify login credential using verifyLogin 
middle ware. Then get the user data using the getUser function.
Then compare the user passwords. If all the credentials pass the 
check, generate token for the user */
postRouter.post('/login', verifyLogin, async (req, res, next) => {
  const { email, password } = req.body;
  const incomingUser = { _email: email };
  try {
    const user = await getUser(incomingUser);
    const passwordPass = await compare(password, user.rows[0]._password); // Check if the password is correct
    if (!passwordPass) {
      throw new Error('These credentials do not match our records');
    }
    const packages = await client.query(
      `SELECT * FROM packages WHERE _username = $1`,
      [user.rows[0]._username]
    );
    const token = sign({ id: user.rows[0].users_id }, 'jfgdjdgkfgerg'); // Generate token for the user
    user.rows[0].auth_token = token;
    res.json({ user: user.rows[0], packages: packages.rows });
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

/* Admin login, first verify login credential using verifyAdminLogin 
middle ware. Then get the user data using the getAdmin function.
Then compare the admin passwords. If all the credentials pass the 
check, generate token for the admin */
postRouter.post('/admins/login', verifyAdminLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await getAdmin(email);
    const passwordPass = await compare(password, admin.rows[0]._password); // Check if the admin password is correct
    if (!passwordPass) {
      throw new Error(`These credentials do not match our records`);
    }
    const token = sign(
      { id: admin.rows[0].admins_id }, // Generate token for the admin
      'jfgdjdgSenditadminkfgerg'
    );
    const packages = await client.query(`SELECT * FROM packages`);
    const users = await client.query(`SELECT * FROM users`);
    admin.rows[0].admin_token = token;
    res.json({
      admin: admin.rows[0],
      packages: packages.rows,
      users: users.rows,
    });
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

/* Validate the new incoming user data. Then check if 
the user already exist. If the user does not exist add 
the user to the database */
postRouter.post('/', async (req, res) => {
  delete req.body.password2;
  const { error } = userValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  } else {
    const salt = await bcrypt.genSalt(5);
    const hashPass = await bcrypt.hash(req.body.password, salt); // encrypt the password
    try {
      const check = await client.query(
        `SELECT EXISTS(SELECT 1 FROM users WHERE _email = $1 OR _username = $2)`,
        [req.body.email, req.body.username]
      );
      if (check.rows[0].exists) {
        throw new Error('Account exist');
      } else {
        const user = req.body;
        user.password = hashPass;
        const userData = Object.values(user);
        userData[4] = 'active';
        const newUser = await postUser(userData);
        if (newUser.rows[0].users_id) {
          const packages = await client.query(
            `SELECT * FROM packages WHERE _username = $1`,
            [newUser.rows[0]._username]
          );
          res.json({ user: newUser.rows[0], packages: packages.rows });
        }
      }
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
});

/* Validate the new incoming admin data. Then check if 
the admin already exist. If the admin does not exist add 
the admin to the database */
postRouter.post('/admins', async (req, res) => {
  delete req.body.password2;
  const { error } = userValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  } else {
    const salt = await bcrypt.genSalt(7);
    const hashPass = await bcrypt.hash(req.body.password, salt); // encrypt the password
    try {
      const check = await client.query(
        `SELECT EXISTS(SELECT 1 FROM admins WHERE _email = $1 OR _username = $2)`,
        [req.body.email, req.body.username]
      );
      if (check.rows[0].exists) {
        throw new Error('Account exist');
      } else {
        const admin = req.body;
        admin.password = hashPass;
        const adminData = Object.values(admin);
        adminData[4] = 'active';
        const newAdmin = await postAdmin(adminData);
        if (newAdmin.rows[0].users_id) {
          const packages = await client.query(`SELECT * FROM packages`);
          const users = await client.query(`SELECT * FROM users`);
          res.json({
            admin: newAdmin.rows[0],
            packages: packages.rows,
            users: users.rows,
          });
        }
      }
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
});

/* Verify the user token using verifyToken middle ware. if 
token is correct, check if the frijile property is empty. 
if everything is fine add the package to the database  */
postRouter.post(
  '/:username/:email/:token/packages',
  verifyUserToken,
  async (req, res) => {
    const { username } = req.params;
    const reqBody = req.body;
    if (reqBody.frajile === '') {
      reqBody['frajile'] = 'package not frajile';
    }
    const { error } = parcelValidation(reqBody); // Validate the incoming package data
    if (error) {
      throw new Error(error.details[0].message);
    } else {
      try {
        const packageData = Object.values(req.body);
        packageData.push('Ready for pickup');
        const newPackage = await postPackage(packageData);
        if (newPackage.rowCount === 1) {
          const userPackage = await client.query(
            'SELECT * FROM packages WHERE _username = $1',
            [username]
          );
          res.json({ packages: userPackage.rows, package: newPackage.rows[0] });
        }
      } catch (error) {
        res.status(400).json({ errMessage: error.message });
      }
    }
  }
);

export default postRouter;
