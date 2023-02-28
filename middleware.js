import * as jose from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.SECRET);

export const config = {
  matcher: [
    '/((?!.*\\.).*)',
  ],
}

// const protectRoutes = {
//   ''
// }

const unprotectedRoutes = [
  '/authentication',
  '/authorization',
  '/'
]

// const match = protectRoutes.some((path) => req.url.includes(path));

export default async function middleware(req) {
  let token = req.cookies.get('token');

  const { pathname } = req.nextUrl;
  const includesUnprotectedRoutes = 
    unprotectedRoutes.some((el) => pathname.includes(el));

  if (includesUnprotectedRoutes) {
    console.log('accessing public route!');
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token.value, secret);
        // TODO: Check if associated user has enough clearance to access,
        //       if not return 403 forbidden
        console.log('token successfully validated!');

        const response = NextResponse.next();
        // send a cookie that describes validation result and, if successful,
        // decoded user info in payload, to ensure after validation the client
        // always has the same user details as when the jwt was initially signed
        response.cookies.set({ 
          name: 'validationResults',
          value: JSON.stringify({  // without .stringify() returns [object Object]
            result: 'success',
            user: payload.payload
          }),
         });
        return response;
      } catch (err) {
        console.log(err);
        req.cookies.delete('token');
        console.log('deleted cookie due to invalid token');

        // set a non-httpOnly cookie to let client know the validation has failed, 
        // then client will erase accordingly
        const response = NextResponse.next();
        response.cookies.set({ 
          name: 'validationResults',
          value: JSON.stringify({
            result: 'failed',
            user: null
          }),
         });
        return response;
      }
    } else if (!token) {
      console.log('no cookies');
      const response = NextResponse.next();
      response.cookies.set({ 
        name: 'validationResults',
        value: JSON.stringify({
          result: 'failed',
          user: null
        }),
      });
      return response;
    }
  }

  try {
    // accessing protected routes requires enhanced security
    if (!token) throw new Error('Invalid token'); 
    const { payload } = await jose.jwtVerify(token.value, secret);
  } catch (err) {
    req.nextUrl.pathname = '/';
    return NextResponse.redirect(req.nextUrl);  
  }
}