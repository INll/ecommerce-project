import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path:`${__dirname}/../ecommerce-project/.env` });

main().catch(err => console.log(err));

console.log(process.env.MONGODB_PATH);

async function main() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_PATH);
}

const kittySchema = new mongoose.Schema({
  name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

const silence = new Kitten({ name: 'Silence' });
console.log(silence.name); // 'Silence'

await silence.save();

const kittens = await Kitten.find();
console.log(kittens);

mongoose.connection.close();