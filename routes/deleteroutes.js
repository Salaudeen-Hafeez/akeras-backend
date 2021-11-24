import { Router } from 'express';
import { verifyAdminToken } from '../authentication/loginauth';
import { deleteUser, deletePackage } from '../database/db';

const deleteRouter = Router();

deleteRouter.delete(
  '/:email/:token/:username/:userid',
  verifyAdminToken,
  async (req, res) => {
    const userid = parseInt(req.params.userid);
    const userData = [req.params.username, userid];
    try {
      const deletedUser = await deleteUser(userData);
      res.json(deletedUser.rows);
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

deleteRouter.delete(
  '/:email/:token/:username/packages/:parcelid',
  async (req, res) => {
    const parcelid = parseInt(req.params.parcelid);
    const parcelCon = [req.params.username, parcelid];
    try {
      const deletedParcel = await deletePackage(parcelCon);
      res.json(deletedParcel.rows[0]);
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default deleteRouter;
