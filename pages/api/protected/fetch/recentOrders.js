import dbConnect from '../../../../lib/mongoose';
import { ItemSchema } from '../../../../../backend/Models';
import { orderSchema } from '../../../../../backend/Models/order';
import mongoose from 'mongoose';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  try {
    await dbConnect();
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
    const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

    if (req.method === 'GET') {
      const { id, maxOrder } = req.query;
      const userId = mongoose.Types.ObjectId(id);

      // find latest orders
      const result = await Order.find({ userName: userId }).sort({ timeOfSale: -1 }).limit(maxOrder).exec();

      if (result === null) {
        return res.json({ message: `There doesn't seem to be any orders made`, result: 0 });
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