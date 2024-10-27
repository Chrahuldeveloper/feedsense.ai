import { NextResponse } from "next/server";

export function middleware(request: any) {
  const authToken = request.cookies.get("auth-token");

  if (!authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
