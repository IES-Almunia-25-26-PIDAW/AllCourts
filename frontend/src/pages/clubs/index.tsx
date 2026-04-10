import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { getClubs, type ClubWithManager } from "@/api/clubApi";

export default function ClubsPage() {
  const [clubs, setClubs] = useState<ClubWithManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getClubs();
        setClubs(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los clubes.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadClubs();
  }, []);

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clubs;
    }

    return clubs.filter((club) => {
      const haystack = [club.name, club.address, club.city, club.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [clubs, query]);

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
      <section style={{ marginBottom: "24px" }}>
        <p style={{ margin: 0, color: "#0d5efd", fontWeight: 700 }}>Clubes</p>
        <h1 style={{ margin: "8px 0 10px", fontSize: "2rem" }}>
          Encuentra tu club
        </h1>
        <p style={{ margin: 0, color: "#555", maxWidth: "700px" }}>
          Busca por nombre, ciudad o descripción y entra al club para ver sus
          pistas.
        </p>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar clubes..."
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

      {loading ? <p>Cargando clubes...</p> : null}
      {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}

      {!loading && !error && filteredClubs.length === 0 ? (
        <p>No hay clubes que coincidan con la búsqueda.</p>
      ) : null}

      {!loading && !error ? (
        <section style={gridStyle}>
          {filteredClubs.map((club) => {
            const coverImage = club.logo_url || "/logoallcourts.png";

            return (
              <article
                key={club.id}
                style={{
                  border: "1px solid #e7e7e7",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div style={{ position: "relative", height: "180px" }}>
                  <Image
                    src={coverImage}
                    alt={club.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div style={{ padding: "16px" }}>
                  <h2 style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>
                    {club.name}
                  </h2>

                  <p style={{ margin: "0 0 10px", color: "#666" }}>
                    {club.city || "Ciudad no disponible"}
                  </p>

                  <p
                    style={{
                      margin: "0 0 16px",
                      color: "#555",
                      lineHeight: 1.5,
                    }}
                  >
                    {club.description || "Sin descripción disponible."}
                  </p>

                  <Link
                    href={`/clubs/${club.id}`}
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
                    Ver club
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
