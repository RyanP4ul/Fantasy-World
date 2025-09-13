import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import LRU from "lru-cache";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/api/auth"];
const protectedRoutes = ["/account", "/store"];
const adminOnlyRoutes = [
  "/panel/web/settings",
  "/panel/auras",
  "/panel/classes",
  "/panel/enhancements",
  "/panel/patterns",
  "/panel/items/skills",
  "/panel/monsters/bosses",
  "/panel/skills",
  "/panel/skills/assign",
  "/panel/skills/auras",
];

export default withAuth(
  async function middleware(req: NextRequest) {

    // const cookieName = process.env.NODE_ENV === "production" 
    //   ? "__Secure-s3c_tkn_a9f4" 
    //   : "s3c_tkn_a9f4";

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      // cookieName: cookieName,
    });
    const { pathname } = req.nextUrl;

    // if (pathname.indexOf("/api/panel") !== -1) {
    //   const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

    //   console.log("IP Address:", ip);

    //   const res = await fetch(
    //     `http://ip-api.com/json/${ip}?fields=status,message,query,isp,org,as,hosting,proxy`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${process.env.API_KEY}`,
    //       },
    //       body: JSON.stringify(req.body),
    //     }
    //   );
    //   const data = await res.json();

    //   if (data.status !== "success") {
    //     return new NextResponse(data.message, { status: 403 });
    //   }

    //   if (data.proxy || data.hosting) {
    //     return new NextResponse(
    //       `VPN/Proxy detected: ${data.query} ${data.isp} ${data.org}`,
    //       { status: 403 }
    //     );
    //   }
    // }

    if (
      publicRoutes.some(
        (publicPath) =>
          publicPath === pathname || pathname.startsWith(publicPath + "/")
      )
    ) {
      return NextResponse.next();
    }

    if (
      protectedRoutes.some((path) => pathname.startsWith(path)) ||
      pathname.indexOf("/panel") !== -1
    ) {
      if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    const user: any = token?.user || null;
    const access = user?.Access;

    if (
      pathname.indexOf("/panel") !== -1 ||
      pathname.indexOf("/api/panel") !== -1
    ) {
      if (access < 40) {
        const url = req.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
    }

    // Admin only
    if (adminOnlyRoutes.some((path) => pathname.startsWith(path))) {
      if (access < 60) {
        const url = req.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/account", "/api/panel/:path*", "/panel/:path*"],
};
