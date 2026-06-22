import { notFound } from "next/navigation";
import { getCategoryBySlug, getFilteredCategoryResources } from "../../../lib/bookshelf/queries";
import CategoryHeader from "../../../components/bookshelf/category-header";
import ResourceCard from "../../../components/bookshelf/resource-card";
import BookshelfSearch from "../../../components/bookshelf/bookshelf-search";
import BookshelfFilters from "../../../components/bookshelf/bookshelf-filters";
import BookshelfSort from "../../../components/bookshelf/bookshelf-sort";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams?: {
    q?: string;
    type?: string;
    sort?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: slug } = params;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const q = searchParams?.q;
  const type = searchParams?.type;
  const sort = searchParams?.sort;

  const isFiltered = Boolean(q || type || sort);

  const resources = await getFilteredCategoryResources(slug, { q, type, sort });

  return (
    <main className="app-shell wide-card">
      <section className="app-card">
        <CategoryHeader name={category.name} count={category._count.resources} />

        {/* Interactive Search Panel */}
        <BookshelfSearch />

        {/* Type Filters & Sorting Controls */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "8px", marginBottom: "28px" }}>
          <BookshelfFilters />
          <BookshelfSort />
        </div>

        {/* Resources Grid */}
        <div className="resource-grid">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="form-message">
              {isFiltered ? "No resources in this category match your filters." : "No resources added in this category yet."}
            </div>
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
