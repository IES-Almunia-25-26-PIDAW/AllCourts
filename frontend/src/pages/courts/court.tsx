import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { getCourts, type CourtWithClub } from "@/api/courtApi";
import { formatPrice } from "@/utils/formatters";
import { SPORT_LABELS, SURFACE_LABELS } from "@/types/court";

/**
 * Listado general de pistas.
 * Sirve como vista de exploración una vez el usuario entra desde un club.
 */
export default function CourtPage() {
  const [courts, setCourts] = useState<CourtWithClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadCourts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourts();
        setCourts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las pistas.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadCourts();
  }, []);

  const filteredCourts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return courts;
    }

    return courts.filter((court) => {
      const haystack = [
        court.name,
        court.club_name,
        court.city,
        court.sport,
        court.surface_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [courts, query]);

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

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: "12px" }}>
        <Link
          href="/clubs"
          style={{ color: "#0d5efd", textDecoration: "none" }}
        >
          ← Volver a clubes
        </Link>
      </div>

      <section style={{ marginBottom: "24px" }}>
        <p style={{ margin: 0, color: "#0d5efd", fontWeight: 700 }}>Pistas</p>
        <h1 style={{ margin: "8px 0 10px", fontSize: "2rem" }}>
          Encuentra tu pista
        </h1>
        <p style={{ margin: 0, color: "#555", maxWidth: "700px" }}>
          Busca por nombre, club, ciudad, deporte o superficie.
        </p>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar pistas..."
          style={{
            marginTop: "18px",
            width: "100%",
            maxWidth: "520px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid #d9d9d9",
            outline: "none",
            fontSize: "16px",
          }}
        />
      </section>

      {loading ? <p>Cargando pistas...</p> : null}
      {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}

      {!loading && !error && filteredCourts.length === 0 ? (
        <p>No hay pistas que coincidan con la búsqueda.</p>
      ) : null}

      {!loading && !error ? (
        <section style={gridStyle}>
          {filteredCourts.map((court) => {
            const coverImage = court.image_url || "/logoallcourts.png";

            return (
              <article
                key={court.id}
                style={{
                  border: "1px solid #e7e7e7",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    height: "180px",
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "rgba(0, 0, 0, 0.55)",
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontSize: "12px",
                    }}
                  >
                    {SPORT_LABELS[court.sport]}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      right: "14px",
                      background: "#0d5efd",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(Number(court.price_60))}
                  </div>
                </div>

                <div style={{ padding: "16px" }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>
                    {court.name}
                  </h2>

                  <p style={{ margin: "0 0 10px", color: "#666" }}>
                    {court.club_name ? court.club_name : "Club sin nombre"}
                    {court.city ? ` · ${court.city}` : ""}
                  </p>

                  <p style={{ margin: "0 0 10px", color: "#888" }}>
                    {SURFACE_LABELS[court.surface_type]}
                  </p>

                  <p
                    style={{
                      margin: "0 0 16px",
                      color: "#555",
                      lineHeight: 1.5,
                    }}
                  >
                    {court.description || "Sin descripción disponible."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: "#f2f4f7",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                      }}
                    >
                      60 min: {formatPrice(Number(court.price_60))}
                    </span>
                    <span
                      style={{
                        background: "#f2f4f7",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                      }}
                    >
                      90 min: {formatPrice(Number(court.price_90))}
                    </span>
                    <span
                      style={{
                        background: "#f2f4f7",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                      }}
                    >
                      120 min: {formatPrice(Number(court.price_120))}
                    </span>
                  </div>

                  <Link
                    href={`/courts/${court.id}`}
                    style={{
                      display: "inline-block",
                      width: "100%",
                      textAlign: "center",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "#111",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
