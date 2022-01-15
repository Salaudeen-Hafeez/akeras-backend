import { Router } from 'express';
import { verifyToken } from '../authentication/loginauth';
import { updateUser, updatePackage, client } from '../database/db';

const updateRouter = Router();

updateRouter.put('/:email', async (req, res) => {
  try {
    let user;
    const con = req.params.email;
    const data = Object.values(req.body);
    const key = Object.keys(req.body);
    if (key.length === 1) {
      user = await updateUser(key[0], data[0], con);
    } else if (key.length === 2) {
      user = await updateUser(key[0], data[0], con);
      user = await updateUser(key[1], data[1], con);
    }
    res.json(user.rows[0]);
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

// UPDATE the status of the user's parcel
updateRouter.put(
  '/:email/:userid/:token/packages/:parcelid',
  verifyToken,
  async (req, res) => {
    const { email, parcelid } = req.params;
    let packages;
    const con = parseInt(parcelid);
    const value = Object.values(req.body);
    const key = Object.keys(req.body);
    try {
      let parcel;
      if (key.length === 1) {
        parcel = await updatePackage(key[0], value[0], con);
      } else if (key.length === 2) {
        parcel = await updatePackage(key[0], value[0], con);
        parcel = await updatePackage(key[1], value[1], con);
      }
      if (email.includes('@sendit.com')) {
        packages = await client.query(`SELECT * FROM packages`);
      } else {
        const user = await client.query(
          `SELECT * FROM users WHERE _email = $1`,
          email
        );
        packages = await client.query(
          `SELECT * FROM packages WHERE _username = $1`,
          [user.rows[0]._username]
        );
      }

      res.json({ package: parcel.rows[0], packages: packages.rows });
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default updateRouter;
