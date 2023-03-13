import dbConnect from '../../../../../lib/mongoose';
import { userSchema } from '../../../../../../backend/Models/user';
import mongoose from 'mongoose';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  try {
    await dbConnect();
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    if (req.method === 'POST') {
      const result = await User.findOne({ userName: req.body.username }).exec();
      if (result === null) {
        return res.json({ message: `Query returned no results`, result: 0 });
      } else {
        return res.json({ message: `success`, result: 1, userDetails: result });
      }
    } else {
      return res.status(405).send({ message: 'invalid method', result: 2 });
    }
  } catch (err) {
    handleError(err);
    return res.status(500).send({ message: `Uknown error: ${err}`, result: 2 });
  }
}