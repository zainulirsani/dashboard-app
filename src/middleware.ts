import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const userRes = await fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!userRes.ok) throw new Error("Gagal mengambil user");

    const user = await userRes.json();
    const userId = user.result.id;
    const role = user.result.role ?? "";

    const aksesRes = await fetch(`http://127.0.0.1:8000/api/hak-akses/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!aksesRes.ok) throw new Error("Gagal mengambil hak akses");

    const aksesData = await aksesRes.json();
    const perusahaan = aksesData.result.perusahaan_diakses || [];

    const pathname = request.nextUrl.pathname;

    const roleRoutes: Record<string, string[]> = {
      admin: ["/admin"],
      manager: ["/manager", "/DetailPerusahaan"],
      kadiv: ["/kadiv", "/DetailPerusahaan"],
    };

    const allowedPaths = roleRoutes[role] || ["/dashboard"];
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    if (!isAllowed) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }

    if (pathname.startsWith("/DetailPerusahaan/")) {
      const slugMatch = pathname.match(/^\/DetailPerusahaan\/([^\/]+)/);
      const slug = slugMatch?.[1] ?? "";

      if (role === "admin") {
        return NextResponse.redirect(new URL(`/${role}`, request.url));
      }

      if (role === "kadiv") {
        const slugsDiizinkan = perusahaan.map((p: any) => p.slug_perusahaan);
        if (!slugsDiizinkan.includes(slug)) {
          return NextResponse.redirect(new URL(`/${role}`, request.url));
        }
      }
    }


    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/kadiv/:path*",
    "/DetailPerusahaan/:slug*",
  ],
};
