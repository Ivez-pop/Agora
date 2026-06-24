import { notFound } from "next/navigation";
import AccountBar from "../../account-bar";
import { getCategoryBySlug, getResourcesByCategory } from "../../../lib/bookshelf/queries";
import ResourceCard from "../../../components/bookshelf/resource-card";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

function CategoryHeader({ name, count }: { name: string; count: number }) {
  return (
    <header className="category-header" style={{ marginBottom: "32px" }}>
      <p className="section-label">Bookshelf &rsaquo; {name}</p>
      <h1 style={{ marginTop: "8px", marginBottom: "12px" }}>{name}</h1>
      <p className="category-desc" style={{ margin: "0", color: "var(--muted)" }}>
        Curated collection containing {count} {count === 1 ? "learning resource" : "learning resources"}.
      </p>
    </header>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = params;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const resources = await getResourcesByCategory(slug);

  return (
    <>
      <AccountBar />
      <main className="app-shell wide-card">
        <section className="app-card">
          <CategoryHeader name={category.name} count={category._count.resources} />

          {/* Resources Grid / Empty States */}
          {resources.length > 0 ? (
            <div className="resource-grid">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div
              style={{
                border: "1px solid var(--line)",
                background: "#fffef8",
                padding: "40px 20px",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                No resources found in this category.
              </h3>
              <p style={{ margin: "0", color: "var(--muted)", fontSize: "1rem" }}>
                Please check back later or recommend resources.
              </p>
            </div>
          )}

          <div style={{ marginTop: "36px" }}>
            <a className="text-link" href="/bookshelf">
              &larr; Back to Bookshelf
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
