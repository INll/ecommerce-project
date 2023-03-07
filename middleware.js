import * as jose from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.SECRET);

export const config = {
  matcher: [
    '/((?!.*\\.).*)',
  ],
}

const privateRoutes = [
  '/profile/admin',
  '/api/admin/fetch/dashboard'
]

const protectedRoutes = [
  '/profile',
]

const unprotectedRoutes = [
  '/'
]

export default async function middleware(req) {
  let token = req.cookies.get('token');

  const { pathname } = req.nextUrl;
  console.log('path is ' + pathname);

  const includesPrivateRoute =
    (privateRoutes.some((path) => pathname === path)) || (pathname.startsWith('/api/admin'));
  
  const includesProtectedRoute = 
    protectedRoutes.some((path) =>(pathname === path));

  const includesUnprotectedRoute = 
    unprotectedRoutes.some((path) => pathname === path);

  // verify jwt
  if (includesUnprotectedRoute) {
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
          value: JSON.stringify({  // was a JSON object, must use JSON.stringify()
            result: 'success',
            user: payload.payload
          }),
         });
        return response;
      } catch (err) {
        console.log(err);
        console.log('invalid token!');

        // set a non-httpOnly cookie to let client know the validation has failed, 
        // then client will erase accordingly
        req.nextUrl.pathname = '/';
        const response = NextResponse.redirect(req.nextUrl);
        response.cookies.set({ 
          name: 'validationResults',
          value: JSON.stringify({
            result: 'failed',
            user: false
          }),
         });
        response.cookies.delete('token');
        return response;
      }
    } else if (!token) {
      console.log('no cookies');
      const response = NextResponse.next();
      response.cookies.set({ 
        name: 'validationResults',
        value: JSON.stringify({
          result: 'failed',
          user: false
        }),
      });
      return response;
    }
  }

  // {"payload":{"_id":"63ecabb23e2de88502535a60","userName":"admin","clearance":2,"orders":[],"creationTime":"2023-02-15T09:53:54.999Z"},"exp":1677739570,"iat":1677717970,"nbf":1677717970}

  // verify jwt and only authorize credentials with clearance >= 2
  if (includesPrivateRoute) {
    console.log('private route attempt');
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token.value, secret);
        if (payload.payload.clearance > 1 && (payload)) {
          console.log('granted access to private route: ' + pathname);
          return NextResponse.next();
        } else {
          throw new Error('Forbidden')
        }
      } catch (err) {
        console.log(err);
        req.nextUrl.pathname = '/';

        return NextResponse.redirect(req.nextUrl);
      } 
    } else {
      console.log(`Redirecting: request to ${pathname} failed`);
      req.nextUrl.pathname = '/';
      return NextResponse.redirect(req.nextUrl);
    }
  }

  try {
    // accessing protected routes requires authorization
    if (!token) throw new Error('Invalid token'); 
    const { payload } = await jose.jwtVerify(token.value, secret);
  } catch (err) {
    if (includesProtectedRoute || includesPrivateRoute) {
      req.nextUrl.pathname = '/';
      return NextResponse.redirect(req.nextUrl);
    } else return NextResponse.next();  // return 404
  }
}