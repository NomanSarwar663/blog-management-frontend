import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BlogCard from "../components/blog/BlogCard";
import BlogFilters from "../components/blog/BlogFilters";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import useAuth from "../hooks/useAuth";
import usePosts from "../hooks/usePosts";

const initialFilters = {
  search: "",
  page: 1,
  limit: 6,
  sortBy: "createdAt",
  order: "desc",
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { posts, pagination, loading, error, fetchPosts } = usePosts();
  const [filters, setFilters] = useState(initialFilters);

  const loadPosts = useCallback(async (nextFilters) => {
    try {
      await fetchPosts({ scope: "public", filters: nextFilters });
    } catch {}
  }, [fetchPosts]);

  useEffect(() => {
    loadPosts(initialFilters);
  }, [loadPosts]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    loadPosts(nextFilters);
  };

  const handlePageChange = (page) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadPosts(nextFilters);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[36px] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-blue-100/50 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            Light, modern publishing platform
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Discover thoughtful articles from authors across the platform.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Browse published blogs, read full posts, and join the conversation through
            comments. Authors and admins can jump straight into a role-aware dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/auth"}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {isAuthenticated ? "Open dashboard" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#latest-posts"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Explore blogs
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { value: "Search", label: "Find posts by title or tags instantly" },
            { value: "Comment", label: "Join discussions on published blogs" },
            { value: "Manage", label: "Role-based dashboard for admins and authors" },
          ].map((item) => (
            <div
              key={item.value}
              className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-lg shadow-blue-100/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="latest-posts" className="mt-12 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Latest Stories
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Public blog feed</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Search published content by title or tag and page through the latest articles.
          </p>
        </div>

        <BlogFilters
          search={filters.search}
          status=""
          onSearchChange={(value) => setFilters((current) => ({ ...current, search: value }))}
          onStatusChange={() => {}}
          onSubmit={handleSearchSubmit}
          submitLabel="Search blogs"
        />

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {loading ? (
          <LoadingSpinner label="Loading published blogs..." />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No blogs found"
            description="Try a different search term or check back after authors publish new content."
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
