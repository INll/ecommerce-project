import dbConnect from '@/lib/mongoose';
import { User } from '@/models/user';
import { Item } from '@/models/item';
import { Order } from '@/models/order';
import constants from '@/lib/constants';
import orderid from 'order-id';
import mongoose from 'mongoose';
import * as jose from 'jose';

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
}

const MAX_ORDER_QUANTITY = 99;

export default async function handler(req, res) {
  try {
    await dbConnect();  // use global connection
    
    if (req.method === 'POST') {
      let token = req.cookies.token;
      const key = new TextEncoder().encode(constants.jwtSecret);
      const { payload } = await jose.jwtVerify(token, key);
      
      // req.body [0]: object containing cart arr  |  [1]: user object  |  [2]: total price
      if (payload.payload.userName !== req.body[1].userName) {
        return res.status(401).json({ message: `Disagreeing credentials`, result: 2 })
      };

      // extract all order items into id and qty pairs and check order validity
      let idQty = req.body[0].cart.map((item) => ({ id: item.id, qty: item.qty, details: item.details }));
      
      // check if all order items exist 
      let ifExist = await Promise.all(idQty.map((element) => {
        return Item.exists({ _id: element.id }).exec();
      }));
      let hasNull = ifExist.some((element) => element === null);
      if (hasNull) {
        return res.status(200).json({ message: 'illegal order: illegal item id', result: 2, ids: null });
      }

      // check if any of the item quantities exceeds maximum amount
      let ifExceedsMaxAmount = idQty.filter((item) => item.qty > MAX_ORDER_QUANTITY);
      if (ifExceedsMaxAmount.length > 0) {
        let illegalItemIDs = ifExceedsMaxAmount.map((item) => item.qty);
        return res.status(200).json({ message: 'illegal order: illegal quantity', result: 3, ids: illegalItemIDs });
      }

      // check if insufficient stock
      let ifStockLessThanQty = await Promise.all(idQty.map((element) => {
        return Item.findOne({ _id: element.id, stock: { $lt: element.qty } }).exec();
        }))
      let illegalItemArr = ifStockLessThanQty.filter((value) => value !== null);  // legal items are nulls
      if (illegalItemArr.length > 0) {
        let illegalItems = illegalItemArr.map((item) => ({ id: item._id.toString(), title: item.title, stock: item.stock }));
        return res.status(200).json({ message: `illegal order: insufficient stock`, result: 4, details: illegalItems });
      }

      // create an order
      let orderItems = idQty.map((obj) => ({ itemid: mongoose.Types.ObjectId(obj.id), amount: obj.qty, title: obj.details.title, url: obj.details.images.url, unitPrice: obj.details.price }));
      let orderID = orderid().generate();
      let regex = /-/gi;  // orderID is stored as number, this removes all dashes in xxxx-xxxxxx-xxxx that orderid generates
      let orderIDInt = orderID.replace(regex, '');

      let newOrder = await Order.create({
        timeOfSale: Date.now(),
        userName: mongoose.Types.ObjectId(payload.payload._id),  // userName stores userID, not username in string
        orderID: orderIDInt,
        itemID: orderItems,
        total: req.body[2],
      })
      return res.status(200).json({ message: `Order ${newOrder} has been created!`, result: 1, orderID: orderID });
    } else {
      return res.status(405).json({ message: 'Invalid method', result: 0 });
    }
  } catch (err) {
    handleError(err, res);
    return res.status(500).send({ error: err, result: 0 });
  }
}