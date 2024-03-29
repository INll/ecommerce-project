import dbConnect from '@/lib/mongoose';
import { Item } from '@/models/item';
import { User } from '@/models/user';
import constants from '@/lib/constants';
import * as jose from 'jose';

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

export default async function handler(req, res) {
  let userInfo;

  try {
    await dbConnect();

    if (req.cookies.token !== undefined) {
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
      } else if (userInfo) {
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