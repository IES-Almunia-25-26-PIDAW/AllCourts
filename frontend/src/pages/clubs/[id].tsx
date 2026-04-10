import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getClubById } from "@/api/clubApi";
import { getCourtsByClubId, type CourtWithClub } from "@/api/courtApi";
import { formatPrice } from "@/utils/formatters";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";
import type { ClubWithManager } from "@/types/club";

/**
 * Detalle de un club.
 * Muestra la información del club y sus pistas asociadas.
 */
export default function ClubDetailPage() {
  const router = useRouter();
  const [club, setClub] = useState<ClubWithManager | null>(null);
  const [courts, setCourts] = useState<CourtWithClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clubId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  useEffect(() => {
    if (!router.isReady || !clubId) {
      return;
    }

    const loadClub = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clubData, courtsData] = await Promise.all([
          getClubById(clubId),
          getCourtsByClubId(clubId),
        ]);

        setClub(clubData);
        setCourts(courtsData);
      } catch (err) {
        setClub(null);
        setCourts([]);
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el club.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadClub();
  }, [router.isReady, clubId]);

  const pageStyle: CSSProperties = {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "32px 20px 64px",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "24px",
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <p>Cargando club...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={pageStyle}>
        <p style={{ color: "#c62828" }}>{error}</p>
        <Link href="/clubs" style={{ color: "#0d5efd" }}>
          Volver al listado
        </Link>
      </main>
    );
  }

  if (!club) {
    return (
      <main style={pageStyle}>
        <p>No se encontró el club.</p>
        <Link href="/clubs" style={{ color: "#0d5efd" }}>
          Volver al listado
        </Link>
      </main>
    );
  }

  const coverImage = club.logo_url || "/logoallcourts.png";

  return (
    <main style={pageStyle}>
      <Link href="/clubs" style={{ color: "#0d5efd", textDecoration: "none" }}>
        ← Volver a clubes
      </Link>

      <section
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            minHeight: "320px",
            borderRadius: "20px",
            backgroundImage: `url(${coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
          }}
        />

        <div>
          <p style={{ margin: 0, color: "#0d5efd", fontWeight: 700 }}>Club</p>

          <h1 style={{ margin: "10px 0 8px", fontSize: "2rem" }}>
            {club.name}
          </h1>

          <p style={{ margin: "0 0 14px", color: "#666", fontSize: "1rem" }}>
            {club.city || "Ciudad no disponible"}
            {club.address ? ` · ${club.address}` : ""}
          </p>

          <p style={{ lineHeight: 1.7, color: "#444" }}>
            {club.description || "Sin descripción disponible."}
          </p>

          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "18px",
              border: "1px solid #e7e7e7",
              background: "#fff",
            }}
          >
            <h2 style={{ margin: "0 0 14px", fontSize: "1.2rem" }}>
              Pistas del club
            </h2>

            <Link
              href="/courts/court"
              style={{
                display: "inline-block",
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#0d5efd",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Ver todas las pistas
            </Link>

            {courts.length === 0 ? (
              <p style={{ color: "#666" }}>
                Este club todavía no tiene pistas cargadas.
              </p>
            ) : (
              <div style={gridStyle}>
                {courts.map((court) => {
                  const coverCourtImage =
                    court.image_url || "/logoallcourts.png";

                  return (
                    <article
                      key={court.id}
                      style={{
                        border: "1px solid #e7e7e7",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          height: "160px",
                          backgroundImage: `url(${coverCourtImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <div style={{ padding: "14px" }}>
                        <p style={{ margin: "0 0 6px", fontWeight: 700 }}>
                          {court.name}
                        </p>

                        <p style={{ margin: "0 0 6px", color: "#666" }}>
                          {SPORT_LABELS[court.sport]}
                        </p>

                        <p style={{ margin: "0 0 10px", color: "#888" }}>
                          {SURFACE_LABELS[court.surface_type]}
                        </p>

                        <p style={{ margin: "0 0 14px", color: "#444" }}>
                          Desde {formatPrice(Number(court.price_60))}
                        </p>

                        <Link
                          href={`/courts/${court.id}`}
                          style={{
                            display: "inline-block",
                            width: "100%",
                            textAlign: "center",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            background: "#111",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 700,
                          }}
                        >
                          Ver pista
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
