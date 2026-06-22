import { getCategories, getRecentResources } from "../../lib/bookshelf/queries";
import CategoryCard from "../../components/bookshelf/category-card";
import ResourceCard from "../../components/bookshelf/resource-card";

export const dynamic = "force-dynamic";

export default async function BookshelfLandingPage() {
  const categories = await getCategories();
  const recentResources = await getRecentResources();

  return (
    <main className="app-shell wide-card">
      <section className="app-card">
        <p className="section-label">Bookshelf</p>
        <h1>The ShardUp Bookshelf.</h1>
        <p>
          Discover curated books, articles, courses, and learning resources recommended by the ShardUp community.
        </p>

        {/* Search Bar Placeholder - UI ONLY */}
        <div className="bookshelf-search-container" style={{ margin: "24px 0 36px" }}>
          <div className="stacked-form">
            <input
              type="text"
              placeholder="Search resources by title, author, or keywords... (Search function coming soon)"
              disabled
              style={{ cursor: "not-allowed", opacity: 0.8 }}
            />
          </div>
        </div>

        {/* Popular Categories */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "18px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
            Browse by Category
          </h2>
          <div className="category-grid">
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <div className="form-message">No categories found.</div>
            )}
          </div>
        </div>

        {/* Recently Added Resources */}
        <div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "18px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
            Recently Added
          </h2>
          <div className="resource-grid">
            {recentResources.length > 0 ? (
              recentResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="form-message">No resources added yet.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
