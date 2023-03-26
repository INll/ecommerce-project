import dbConnect from '@/lib/mongoose';
import { User } from '@/models/user';
import { Order } from '@/models/order';
import { Item } from '@/models/item';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'POST') {
      const result = await Order.findOne({ orderID: req.body.id }).exec();
      if (result === null) {
        return res.json({ message: `Query returned no results`, result: 0 });
      } else {
        // result.userName returns 'new ObjectId('xxxxxxx'), need to convert to string to use in findById()
        let username = await User.findById(result.userName.toString(), 'userName');
        // get item infos on all items in an order
        const objectIdArr = result.itemID.map(item => item.itemid.toString());  // TODO: If 
        const amountArr = result.itemID.map(item => item.amount);
        const itemResults = await Item.find({
          _id: { $in: objectIdArr }  // items where _id match at least one of $in
        });
        return res.json({ message: `success`, result: 1, orderDetails: result, username: username, itemDetails: itemResults, itemAmounts: amountArr });
      }
    } else {
      return res.status(405).send({ message: 'invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err);
    return res.status(500).send({ message: `Uknown error: ${err}`, result: 0 });
  }
}