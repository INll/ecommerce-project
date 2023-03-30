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
]

const protectedRoutes = [
  /^\/profile(?!.*admin$).*/,
]

const unprotectedRoutes = [
  /^\/$/,
]

function setValidationResult(res, result, payload) {
  res.cookies.set({
    name: 'validationResults',
    value: JSON.stringify({
      result: result,
      user: payload
    }),
  });
  return res;
}

export default async function middleware(req) {
  let token = req.cookies.get('token');

  const { pathname } = req.nextUrl;
  console.log('path is ' + pathname);

  const includesPrivateRoute =
    (privateRoutes.some((path) => pathname === path)) || (pathname.startsWith('/api/admin'));
  
  const includesProtectedRoute = 
    protectedRoutes.some((regex) => regex.test(pathname)) || (pathname.startsWith('/api/protected'));

  const includesUnprotectedRoute = 
    unprotectedRoutes.some((regex) => regex.test(pathname)) || (pathname.startsWith('/api/public'));

  // verify jwt but let request pass regardless
  if (includesUnprotectedRoute) {
    console.log('accessing public route!');
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token.value, secret);
        console.log('token successfully validated!');

        let response = NextResponse.next();
        return setValidationResult(response, 'success', payload.payload);
      } catch (err) {  // jwtVerify() resolves to an error
        console.log(err);
        console.log('invalid token!');

        // set a non-httpOnly cookie to let client know the validation has failed, 
        // then client will erase accordingly
        req.nextUrl.pathname = '/';
        let response = NextResponse.redirect(req.nextUrl);
        response = setValidationResult(response, 'failed', false);
        response.cookies.delete('token');
        return response;
      }
    } else if (!token) {
      console.log('no cookies');
      let response = NextResponse.next();
      return setValidationResult(response, 'failed', false);
    }
  }

  if (includesProtectedRoute) {
    console.log('protected route attempt');
    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token.value, secret);
        console.log('clearance: ' + payload.payload.clearance);
        if (payload.payload.clearance >= 0 && (payload)) {
          console.log('granted access to protected route: ' + pathname);
          let response = NextResponse.next()
          return setValidationResult(response, 'success', payload.payload);
        } else {
          throw new Error('Forbidden');
        }
      } catch (err) {
        console.log(err);
        req.nextUrl.pathname = '/';
        let response = NextResponse.redirect(req.nextUrl)
        response = setValidationResult(response, 'failed', false);
        response.cookies.delete('token');
        return response;
      }
    } else {
      console.log(`Redirecting: request to ${pathname} failed`);
      req.nextUrl.pathname = '/';
      return NextResponse.redirect(req.nextUrl);
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
          let response = NextResponse.next();
          return setValidationResult(response, 'success', payload.payload);
        } else {
          throw new Error('Forbidden');
        }
      } catch (err) {
        console.log(err);
        req.nextUrl.pathname = '/';
        
        let response = NextResponse.redirect(req.nextUrl)
        response = setValidationResult(response, 'failed', false);
        response.cookies.delete('token');
        return response;
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