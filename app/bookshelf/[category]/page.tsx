import { notFound } from "next/navigation";
import { getCategoryBySlug, getResourcesByCategory } from "../../../lib/bookshelf/queries";
import CategoryHeader from "../../../components/bookshelf/category-header";
import ResourceCard from "../../../components/bookshelf/resource-card";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = params;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const resources = await getResourcesByCategory(slug);

  return (
    <main className="app-shell wide-card">
      <section className="app-card">
        <CategoryHeader name={category.name} count={category._count.resources} />

        {/* Filter UI Placeholder - UI Only */}
        <div className="filter-container" style={{ margin: "24px 0 32px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Filter by Type:
          </span>
          <div style={{ width: "200px" }}>
            <select
              disabled
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--line)",
                background: "#fffef8",
                color: "var(--muted)",
                cursor: "not-allowed",
                fontFamily: "var(--font-main)",
                fontWeight: "bold",
              }}
            >
              <option>All Types</option>
              <option>Books</option>
              <option>Articles</option>
              <option>Courses</option>
              <option>Videos</option>
              <option>Research Papers</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="resource-grid">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="form-message">No resources added in this category yet.</div>
          )}
        </div>

        <div style={{ marginTop: "36px" }}>
          <a className="text-link" href="/bookshelf">
            &larr; Back to Bookshelf
          </a>
        </div>
      </section>
    </main>
  );
}
