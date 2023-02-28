import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/mongoose.js';
import { userSchema } from '../../../backend/Models/user.js';
import mongoose from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config();

function handleError (err, res) {
  console.error(`Error: ${err}`);
  console.log(err.stack);
  res.json(err);
  res.status(405).end();
}

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (err) {
    handleError(err, res);
  }