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
  verifyAdminLogin,
  verifyLogin,
  verifyToken,
} from '../authentication/loginauth';
import {
  userValidation,
  parcelValidation,
} from '../authentication/reqbodyauth';

const postRouter = Router();
const { compare } = bcrypt;
const { sign } = jwt;

postRouter.post('/login', verifyLogin, async (req, res, next) => {
  const { email, password } = req.body;
  const incomingUser = { _email: email };
  try {
    const user = await getUser(incomingUser);
    const passwordPass = await compare(password, user.rows[0]._password);
    if (!passwordPass) {
      throw new Error('wrong password entered');
    }
    const token = sign({ id: user.rows[0].users_id }, 'jfgdjdgkfgerg');
    user.rows[0].auth_token = token;
    res.json(user.rows[0]);
  } catch (error) {
    res.status(400).json({ password: error.message });
  }
});

postRouter.post('/admins/login', verifyAdminLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await getAdmin(email);
    const passwordPass = await compare(password, admin.rows[0]._password);
    if (!passwordPass) {
      throw new Error('wrong admin password entered');
    }
    const token = sign(
      { id: admin.rows[0].admins_id },
      'jfgdjdgSenditadminkfgerg'
    );
    admin.rows[0].admin_token = token;
    res.json(admin.rows[0]);
  } catch (error) {
    res.status(400).json({ password: error.message });
  }
});

// Add new user to the database
postRouter.post('/', async (req, res) => {
  delete req.body.password2;
  const { error } = userValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  } else {
    const salt = await bcrypt.genSalt(5);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    try {
      const check = await client.query(
        `SELECT EXISTS(SELECT 1 FROM users WHERE _email = $1 OR _username = $2)`,
        [req.body.email, req.body.username]
      );
      if (check.rows[0].exists) {
        throw new Error(
          `User with ${req.body.email} or ${req.body.username} exist`
        );
      } else {
        const user = req.body;
        user.password = hashPass;
        const userData = Object.values(user);
        userData[4] = 'active';
        const newUser = await postUser(userData);
        res.json(newUser.rows[0]);
      }
    } catch (error) {
      res.status(400).json({ username: error.message });
    }
  }
});

postRouter.post('/admins', async (req, res) => {
  delete req.body.password2;
  const { error } = userValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  } else {
    const salt = await bcrypt.genSalt(7);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    try {
      const check = await client.query(
        `SELECT EXISTS(SELECT 1 FROM admins WHERE _email = $1 OR _username = $2)`,
        [req.body.email, req.body.username]
      );
      if (check.rows[0].exists) {
        throw new Error(
          `Admin with ${req.body.email} or ${req.body.username} exist`
        );
      } else {
        const admin = req.body;
        admin.password = hashPass;
        const adminData = Object.values(admin);
        adminData[4] = 'active';
        const newAdmin = await postAdmin(adminData);
        res.json(newAdmin.rows[0]);
      }
    } catch (error) {
      res.status(400).json({ username: error.message });
    }
  }
});

// Add parcel order for the user
postRouter.post(
  '/:username/:email/:token/packages',
  verifyToken,
  async (req, res) => {
    const reqBody = req.body;
    if (reqBody.frajile === '') {
      reqBody['frajile'] = 'package not frajile';
    }
    const { error } = parcelValidation(reqBody);
    if (error) {
      throw new Error(error.details[0].message);
    } else {
      try {
        const packageData = Object.values(req.body);
        packageData.push('At the location');
        const newPackage = await postPackage(packageData);
        res.json(newPackage.rows[0]);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);

export default postRouter;
