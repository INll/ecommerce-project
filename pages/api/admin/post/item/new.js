import dbConnect from '../../../../../lib/mongoose';
import { ItemSchema, Item } from '../../../../../../backend/Models/item';
import formidable from 'formidable';
import mongoose from 'mongoose';

function handleError (err) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
  res.json(err);
  res.status(405).end();
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const formidableOpts = {
  multiples: false,
  maxFileSize: 3 * 1024 * 1024,
}

export default async function handler(req, res) {
  try {
    await dbConnect();  // use global connection
    const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
    
    if (req.method === 'POST') {
    const form = formidable(formidableOpts);

    form.parse((req, (err, fields, files) => {
      if (err) {
        console.log('formidable parsing error');
        return res.status(400).json({ message: 'Failed to parse file' });
      }
      console.log('fields: ', fields);
      console.log('files: ', files);
    }))
    } else {
      res.status(405).json({ message: 'Invalid method' });
    }
  } catch (err) {
    handleError(err);
    res.status(500).send({ error: err });
  }
}