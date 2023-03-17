import dbConnect from '../../../../lib/mongoose';
import { ItemSchema } from '../../../../../backend/Models';
import { userSchema } from '../../../../../backend/Models/user';
import constants from '../../../../lib/constants';
import * as jose from 'jose';
import mongoose from 'mongoose';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

// sort based on 'sort' value from req.query
const sortArgs = {
  '默認': {},
  '種類': { itemType: 1 },
  '價格(低至高)': { price: 1 },
  '價格(高至低)': { price: -1 },
}

let userInfo = null;

export default async function handler(req, res) {
  try {
    await dbConnect();
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

    // also update user info on initial fetch, if logged in
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    if (req.cookies.token) {
      let token = req.cookies.token;
      const key = new TextEncoder().encode(constants.jwtSecret);
      const { payload } = await jose.jwtVerify(token, key);
      userInfo = await User.findOne({ userName: payload.payload.userName }).exec();
    }

    if (req.method === 'GET') {
      const { limit, sort } = req.query;
      console.log('received sorting method: |||||| ' + sort);

      const result = await Item.find(null, null, {limit: limit}).sort(sortArgs[sort]).exec();
      if (result === null) {
        return res.json({ message: `Item.find() returned no results`, result: 0 });
      } else if (userInfo !== null) {
        return res.json({ message: `success with favItem`, result: 2, data: result, user: userInfo });
      } else {
        return res.json({ message: `success`, result: 1, data: result });
      }
    } else {
      return res.status(405).send({ message: 'invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err);
    return Promise.reject('Unknown error');
  }
}