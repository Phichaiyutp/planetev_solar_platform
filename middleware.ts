import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';


export async function middleware(request: NextRequest) {
  try {
     const cookieStore = cookies();
    const access_token_cookie = cookieStore.get('access_token')?.value;
    let access_token = access_token_cookie;
    
    if (!access_token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            access_token = authHeader.split(' ')[1];
        }
    }
    
    if (!access_token) {
        throw new Error('Access token not found');
    }

    const secretKey: string = process.env.NEXT_PUBLIC_KEY|| '';
    const key = new TextEncoder().encode(secretKey);
    await jwtVerify(access_token, key, {
      algorithms: ['HS256'],
    });
    return NextResponse.next();
    
  } catch (error) {
    if (error instanceof JWTExpired) {
      try {
        const cookieStore = cookies();
        const refresh_token = cookieStore.get('refresh_token')?.value;
        if (!refresh_token) {
          throw new Error('Refresh token not found');
        }
        const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/refresh`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refresh_token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Refresh request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.status == 'ok') {
          const response = NextResponse.next()
          response.cookies.set("access_token", data.access_token);
          return response
        }else if(data.status == 'expired'){
          //throw new Error('Refresh expired');
        }else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        console.log('Error during token refresh:', error);
        return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}/login`, request.url));
      }
    } else {
      //console.error('JWT verification error:', error);
      return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}/login`, request.url));
    }
  }
}

export const config = {
  matcher: ['/dashboard','/notify/:path*'],
};
