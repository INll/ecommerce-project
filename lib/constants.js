import * as dotenv from 'dotenv';
dotenv.config();

let constants;

export default constants = {
  dbPath: process.env.MONGODB_PATH,
  jwtSecret: process.env.SECRET
};