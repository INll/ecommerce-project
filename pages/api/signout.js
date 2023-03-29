import { NextRequest, NextResponse } from 'next/server';
import { setCookie, deleteCookie } from "cookies-next";

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // const cookies = new Cookies(req.cookies);
      deleteCookie('token', { req, res });
      // by convention values stored in this cookie must be object
      let validationResult = {
        result: 'signedOut',
        user: null
      }
      setCookie('validationResults', JSON.stringify(validationResult), { req, res });
      // console.log('clearing cookies');
      res.status(200).json({ message: 'logout success'});
    } else {
      res.status(405).json({ message: 'Invalid method' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
}