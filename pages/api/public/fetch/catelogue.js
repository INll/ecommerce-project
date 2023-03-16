import dbConnect from '../../../../lib/mongoose';
import { ItemSchema } from '../../../../../backend/Models';
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

export default async function handler(req, res) {
  try {
    await dbConnect();
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

    if (req.method === 'GET') {
      const { limit, sort } = req.query;
      console.log('received sorting method: |||||| ' + sort);

      const result = await Item.find(null, null, {limit: limit}).sort(sortArgs[sort]).exec();
      if (result === null) {
        return res.json({ message: `Item.find() returned no results`, result: 0 });
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