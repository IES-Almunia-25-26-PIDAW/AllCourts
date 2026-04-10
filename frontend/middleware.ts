import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware para proteger rutas y redirigir según sesión.
 * - Busca token en la cookie `allcourts_token` o `token`.
 * - Rutas protegidas: `/profile`, `/player/*`, `/manager/*`, `/booking/*`.
 * - Rutas públicas: `/login`, `/register` (si ya hay token redirige al dashboard).
 *
 * Nota: Este middleware comprueba cookies, no localStorage. Para que funcione
 * correctamente debes establecer la cookie `allcourts_token` (idealmente httpOnly)
 * cuando el usuario se autentique en el backend.
 */
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

  const privatePrefixes = ["/profile", "/player", "/manager", "/booking"];

  const isPublic = publicPaths.includes(pathname);
  const isPrivate = privatePrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (token) {
    if (isPublic) {
      const url = req.nextUrl.clone();
      url.pathname = "/profile"; //RUTA POR DEFECTO PARA USUARIOS LOGUEADOS
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
  ],
};
