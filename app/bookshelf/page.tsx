import { getCategories, getRecentResources, getFilteredResources } from "../../lib/bookshelf/queries";
import CategoryCard from "../../components/bookshelf/category-card";
import ResourceCard from "../../components/bookshelf/resource-card";
import BookshelfSearch from "../../components/bookshelf/bookshelf-search";
import BookshelfFilters from "../../components/bookshelf/bookshelf-filters";
import BookshelfSort from "../../components/bookshelf/bookshelf-sort";

export const dynamic = "force-dynamic";

interface LandingPageProps {
  searchParams?: {
    q?: string;
    type?: string;
    sort?: string;
  };
}

export default async function BookshelfLandingPage({ searchParams }: LandingPageProps) {
  const categories = await getCategories();

  const q = searchParams?.q;
  const type = searchParams?.type;
  const sort = searchParams?.sort;

  const isFiltered = Boolean(q || type || sort);

  // Fetch filtered list or default recent resources
  const resources = isFiltered
    ? await getFilteredResources({ q, type, sort })
    : await getRecentResources();

  return (
    <main className="app-shell wide-card">
      <section className="app-card">
        <p className="section-label">Bookshelf</p>
        <h1>The ShardUp Bookshelf.</h1>
        <p>
          Discover curated books, articles, courses, and learning resources recommended by the ShardUp community.
        </p>

        {/* Interactive Search Panel */}
        <BookshelfSearch />
        
        {/* Type Filters & Sorting Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "28px" }}>
          <BookshelfFilters />
          <BookshelfSort />
        </div>

        {/* Popular Categories (Only show if not filtering search results) */}
        {!isFiltered ? (
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
        ) : null}

        {/* Curated Resources List */}
        <div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "18px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
            {isFiltered ? "Search Results" : "Recently Added"}
          </h2>
          <div className="resource-grid">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))
            ) : (
              <div className="form-message">
                {isFiltered ? "No resources match your filters." : "No resources added yet."}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
