import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only run on the home page
  if (request.nextUrl.pathname === "/") {
    // Check for client-side handling by passing a special header
    // The actual check will be done client-side since middleware
    // doesn't have access to localStorage
    return NextResponse.next({
      headers: {
        "x-check-registration": "1",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};