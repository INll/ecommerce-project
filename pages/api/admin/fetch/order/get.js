import dbConnect from '../../../../../lib/mongoose';
import { userSchema } from '../../../../../../backend/Models/user';
import { orderSchema } from '../../../../../../backend/Models/order';
import { ItemSchema } from '../../../../../../backend/Models';
import mongoose from 'mongoose';
import { storage } from '../../../../../firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

export default async function handler(req, res) {
  try {
    await dbConnect();
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

    if (req.method === 'POST') {
      const result = await Order.findOne({ orderID: req.body.id }).exec();
      if (result === null) {
        return res.json({ message: `Query returned no results`, result: 0 });
      } else {
        // result.userName returns 'new ObjectId('xxxxxxx'), need to convert to string to use in findById()
        let username = await User.findById(result.userName.toString(), 'userName');
        // get item infos on all items in an order
        let objectIdArr = result.itemID.map(item => item.itemid.toString());
        let itemResults = await Item.find({
          _id: { $in: objectIdArr }  // items where _id match at least one of $in
        });
        return res.json({ message: `success`, result: 1, orderDetails: result, username: username, itemDetails: itemResults });
      }
    } else {
      return res.status(405).send({ message: 'invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err);
    return res.status(500).send({ message: `Uknown error: ${err}`, result: 0 });
  }
}