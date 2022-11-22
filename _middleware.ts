import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware (req : NextRequest) {
  //Token will exist if user is logged in
  const token = await getToken({req, secret: process.env.JWT_SECRET});

  console.log("Moddleware token is ");

  const { pathname } = req.nextUrl;

  //Allow the requests is the following is true...
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  //Redirect to login if they don't have token and requesting a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(`/login`);
  }
}