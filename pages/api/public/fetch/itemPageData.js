import dbConnect from '@/lib/mongoose';
import { ItemSchema } from '@/models/item';
import { userSchema } from '@/models/user';
import constants from '@/lib/constants';
import * as jose from 'jose';
import mongoose from 'mongoose';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  let userInfo;

  try {
    await dbConnect();
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

    // also update user info on initial fetch, if logged in
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    if (req.cookies.token !== undefined) {
      let token = req.cookies.token;
      const key = new TextEncoder().encode(constants.jwtSecret);
      const { payload } = await jose.jwtVerify(token, key);
      userInfo = await User.findOne({ userName: payload.payload.userName }).exec();
    }

    if (req.method === 'GET' && req.query) {
      const { itemID } = req.query;
      const result = await Item.findById(itemID).exec();
      if (result) {
        const youMayAlsoLikes = await Item.find({ _id: { $ne: result._id }, itemType: result.itemType }, null, { limit: 5 }).exec();

        if (result === null) return res.json({ message: `Item.find() returned no results`, result: 0 });
  
        if (userInfo) {
          return res.json({ message: `success with favItem`, result: 2, data: result, user: userInfo, extra: youMayAlsoLikes });
        } else {
          return res.json({ message: `success`, result: 1, data: result, extra: youMayAlsoLikes });
        }
      }
    } else {
      return res.status(405).send({ message: 'invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err);
    return Promise.reject('Unknown error');
  }
}