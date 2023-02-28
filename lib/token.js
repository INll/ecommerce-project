import * as jose from 'jose';
const jwtSecret = process.env.SECRET;

const secret = new TextEncoder().encode(jwtSecret);

export async function signToken(payload) {
  console.log(payload);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 6 * 60 * 60;

  return new jose.SignJWT({ payload })
    .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(secret);
}

export async function verifyToken(req) {
  let token = req.cookies.get('token')?.token;

  if (!token) throw new Error('Missing token');

  // return decoded payload
  try {
    return jose.jwtVerify(token, constants.jwtSecret);
  } catch (err) {
    throw new Error('Invalid token');
  }
}