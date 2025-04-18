import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ApprovalStatus, UserRole } from "./types";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userData = request.cookies.get("user")?.value;
  
  if (!token || !userData) {
    return NextResponse.next();
  }

  try {
    const user = JSON.parse(userData);
    const isStudent = user.role === UserRole.STUDENT;
    const isApproved = user.approvalStatus === ApprovalStatus.APPROVED;
    const isAccountStatusPage = request.nextUrl.pathname === "/account-status";

    if (isStudent && !isApproved && !isAccountStatusPage) {
      return NextResponse.redirect(new URL("/account-status", request.url));
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 