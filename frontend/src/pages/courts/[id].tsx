import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCourtById, type CourtWithClub } from "@/api/courtApi";
import { formatPrice } from "@/utils/formatters";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";

export default function CourtDetailPage() {
  const router = useRouter();
  const [court, setCourt] = useState<CourtWithClub | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courtId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  useEffect(() => {
    if (!router.isReady || !courtId) {
      return;
    }

    const loadCourt = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourtById(courtId);
        setCourt(data);
      } catch (err) {
        setCourt(null);
        setError(
          err instanceof Error ? err.message : "No se pudo cargar la pista.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCourt();
  }, [router.isReady, courtId]);

  const backHref = court?.club_id ? `/clubs/${court.club_id}` : "/clubs";

  if (loading) {
    return (
      <main
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" }}
      >
        <p>Cargando pista...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" }}
      >
        <p style={{ color: "#c62828" }}>{error}</p>
        <Link href={backHref} style={{ color: "#0d5efd" }}>
          Volver al club
        </Link>
      </main>
    );
  }

  if (!court) {
    return (
      <main
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" }}
      >
        <p>No se encontró la pista.</p>
        <Link href={backHref} style={{ color: "#0d5efd" }}>
          Volver al club
        </Link>
      </main>
    );
  }

  const coverImage = court.image_url || "/logoallcourts.png";

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 20px 64px",
      }}
    >
      <Link
        href={backHref}
        style={{ color: "#0d5efd", textDecoration: "none" }}
      >
        ← Volver al club
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
          <p style={{ margin: 0, color: "#0d5efd", fontWeight: 700 }}>
            {SPORT_LABELS[court.sport]}
          </p>

          <h1 style={{ margin: "10px 0 8px", fontSize: "2rem" }}>
            {court.name}
          </h1>

          <p style={{ margin: "0 0 14px", color: "#666", fontSize: "1rem" }}>
            {court.club_name ? court.club_name : "Club sin nombre"}
            {court.city ? ` · ${court.city}` : ""}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                background: "#f2f4f7",
                padding: "8px 12px",
                borderRadius: "999px",
              }}
            >
              Superficie: {SURFACE_LABELS[court.surface_type]}
            </span>
            <span
              style={{
                background: "#f2f4f7",
                padding: "8px 12px",
                borderRadius: "999px",
              }}
            >
              Dirección: {court.address || "No disponible"}
            </span>
          </div>

          <p style={{ lineHeight: 1.7, color: "#444" }}>
            {court.description || "Sin descripción disponible."}
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
            <h2 style={{ margin: "0 0 14px", fontSize: "1.2rem" }}>Precios</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "#f8f8f8",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ margin: 0, color: "#666" }}>60 min</p>
                <strong>{formatPrice(Number(court.price_60))}</strong>
              </div>
              <div
                style={{
                  background: "#f8f8f8",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ margin: 0, color: "#666" }}>90 min</p>
                <strong>{formatPrice(Number(court.price_90))}</strong>
              </div>
              <div
                style={{
                  background: "#f8f8f8",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p style={{ margin: 0, color: "#666" }}>120 min</p>
                <strong>{formatPrice(Number(court.price_120))}</strong>
              </div>
            </div>

            <p style={{ marginTop: "14px", color: "#666" }}>
              La reserva se conectará en el siguiente paso.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
