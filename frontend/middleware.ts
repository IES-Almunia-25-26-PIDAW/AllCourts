import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware para proteger rutas y redirigir según sesión.
 * - Busca token en la cookie `allcourts_token` o `token`.
 * - Rutas protegidas: `/profile`, `/player/*`, `/manager/*`, `/booking/*`.
 * - Rutas públicas: `/login`, `/register` (si ya hay token redirige a clubs).
 *
 * Nota: Este middleware comprueba cookies, no localStorage. Para que funcione
 * correctamente debes establecer la cookie `allcourts_token` (idealmente httpOnly)
 * cuando el usuario se autentique en el backend.
 */

function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);
    const decoded = JSON.parse(json) as { role?: string };

    return typeof decoded.role === "string" ? decoded.role : null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get("allcourts_token")?.value ||
    req.cookies.get("token")?.value ||
    null;

  const publicPaths = ["/login", "/register"];

  const privatePrefixes = [
    "/profile",
    "/player",
    "/manager",
    "/booking",
    "/clubs",
    "/courts",
    "/subscription",
  ];

  const isPublic = publicPaths.includes(pathname);
  const isPrivate = privatePrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (token) {
    if (pathname.startsWith("/manager")) {
      const role = getRoleFromToken(token);

      if (role !== "manager") {
        const url = req.nextUrl.clone();
        url.pathname = "/clubs";
        return NextResponse.redirect(url);
      }
    }

    if (isPublic) {
      const url = req.nextUrl.clone();
      url.pathname = "/clubs"; //RUTA POR DEFECTO PARA USUARIOS LOGUEADOS
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } else {
    if (isPrivate) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `from=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/profile",
    "/player/:path*",
    "/manager/:path*",
    "/booking/:path*",
    "/login",
    "/register",
    "/clubs",
    "/clubs/:path*",
    "/courts",
    "/courts/:path*",
    "/subscription",
    "/subscription/:path*",
  ],
};
