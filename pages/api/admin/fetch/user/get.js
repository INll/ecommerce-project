import dbConnect from '@/lib/mongoose';
import { User } from '@/models/user';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  try {
    await dbConnect();

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