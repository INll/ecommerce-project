import dbConnect from '@/lib/mongoose';
import { userSchema } from '@/models/user';
import mongoose from 'mongoose';
import { countLastMonth, countThisMonth, countLast30Days } from '@/lib/aggregation';

function handleError (err) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
  res.json(err);
  res.status(405).end();
}

export default async function handler(req, res) {
  try {
    await dbConnect();  // use global connection
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // dashboard has three data to get: (1) New users this month, (2) mae and (3) ame
    if (req.method === 'GET') {
      // get new users this month
      const newUsersThisMonth = await User.aggregate(countThisMonth);
      const newUsersLastMonth = await User.aggregate(countLastMonth);
      const usersLast30Days = await User.aggregate(countLast30Days);
      
      // handle `undefined` returned by $count operator if no matching documents were found
      let queryResult = [newUsersThisMonth, newUsersLastMonth, usersLast30Days].map(e => ((e.length === 0) ? 0 : e[0].result));
      // TODO: Implement average monthly expenditure aggregation. Currently I'm faking a N/A response.
      queryResult.push('N/A');
      console.log(queryResult);
      res.status(200).json({ message: queryResult });
    } else {
      res.status(405).json({ message: 'Invalid method' });
    }
  } catch (err) {
    handleError(err);
    res.status(500).send({ error: err });
  }
}