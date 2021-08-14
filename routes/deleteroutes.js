import { Router } from 'express';
import { verifyToken } from '../authentication/loginauth';
import { deleteUser, deletePackage } from '../database/db';

const deleteRouter = Router();

deleteRouter.delete('/:email/:userid', async (req, res) => {
  const userid = parseInt(req.params.userid);
  const userData = [req.params.email, userid];
  try {
    const deletedUser = await deleteUser(userData);
    res.json(deletedUser.rows);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

deleteRouter.delete('/:email/packages/:parcelid', async (req, res) => {
  const parcelid = parseInt(req.params.parcelid);
  const parcelCon = [req.params.email, parcelid];
  try {
    const deletedParcel = deletePackage(parcelCon);
    res.json(parcelCon);
    res.json(deletedParcel.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default deleteRouter;
