import { BarChart3, Eye, FilePlus2, PencilLine, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  status: "",
  page: 1,
  limit: 6,
  sortBy: "updatedAt",
  order: "desc",
};

const DashboardPage = () => {
  const { isAdmin, user } = useAuth();
  const {
    posts,
    pagination,
    loading,
    error,
    fetchPosts,
    deletePost,
    getStats,
    updatePostStatus,
  } = usePosts();
  const [filters, setFilters] = useState(initialFilters);
  const [stats, setStats] = useState(null);
  const [actionId, setActionId] = useState("");

  const loadDashboard = useCallback(async (nextFilters) => {
    try {
      await fetchPosts({ scope: "mine", filters: nextFilters });

      if (isAdmin) {
        const nextStats = await getStats();
        setStats(nextStats);
      }
    } catch {}
  }, [fetchPosts, getStats, isAdmin]);

  useEffect(() => {
    loadDashboard(initialFilters);
  }, [loadDashboard]);

  const dashboardCards = useMemo(() => {
    if (isAdmin && stats) {
      return [
        { title: "Total posts", value: stats.totalPosts },
        { title: "Published", value: stats.publishedPosts },
        { title: "Drafts", value: stats.draftPosts },
      ];
    }

    return [
      { title: "Managed posts", value: pagination?.totalPosts || posts.length },
      { title: "Published on page", value: posts.filter((post) => post.status === "published").length },
      { title: "Drafts on page", value: posts.filter((post) => post.status === "draft").length },
    ];
  }, [isAdmin, pagination?.totalPosts, posts, stats]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    loadDashboard(nextFilters);
  };

  const handlePageChange = (page) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadDashboard(nextFilters);
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm("Delete this post permanently?");

    if (!confirmed) {
      return;
    }

    setActionId(postId);

    try {
      await deletePost(postId);
      loadDashboard(filters);
    } finally {
      setActionId("");
    }
  };

  const handleStatusToggle = async (post) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    setActionId(post._id);

    try {
      await updatePostStatus(post._id, nextStatus);
      loadDashboard(filters);
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
            {isAdmin ? "Admin Console" : "Author Workspace"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {isAdmin
              ? "Monitor the full publishing pipeline, open drafts, and keep every article under control."
              : "Manage your own blog posts, update statuses, and open each article to review the comment thread."}
          </p>
        </div>

        <Link
          to="/dashboard/posts/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FilePlus2 className="h-4 w-4" />
          New post
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardCards.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-blue-100 bg-blue-50/70 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">{item.title}</p>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      {isAdmin && stats?.topAuthors?.length ? (
        <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-lg shadow-blue-100/30">
          <h2 className="text-xl font-semibold text-slate-900">Top authors</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.topAuthors.map((author) => (
              <div key={author.authorId} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">{author.name}</p>
                <p className="mt-1 text-sm text-slate-500">{author.email}</p>
                <p className="mt-3 text-sm text-blue-700">{author.postCount} posts</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {isAdmin ? "All managed posts" : "Your posts"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Search, filter, publish, edit, or delete posts from one clean workspace.
            </p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {isAdmin ? "Comment review lives inside post details." : "Open a post to read comments."}
          </div>
        </div>

        <BlogFilters
          search={filters.search}
          status={filters.status}
          showStatus
          onSearchChange={(value) => setFilters((current) => ({ ...current, search: value }))}
          onStatusChange={(value) => setFilters((current) => ({ ...current, status: value }))}
          onSubmit={handleSearchSubmit}
          submitLabel="Apply filters"
        />

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {loading ? (
          <LoadingSpinner label="Loading dashboard posts..." />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts found"
            description="Create your first blog post or adjust your current filters."
            actionLabel="Create post"
            actionTo="/dashboard/posts/new"
          />
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              {posts.map((post) => (
                <div key={post._id} className="space-y-4 rounded-[30px] border border-white/70 bg-white p-4 shadow-lg shadow-blue-100/30">
                  <BlogCard post={post} showStatus />
                  <div className="flex flex-wrap gap-3 px-2 pb-2">
                    <Link
                      to={`/posts/${post._id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link
                      to={`/dashboard/posts/${post._id}/edit`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(post)}
                      disabled={actionId === post._id}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {actionId === post._id
                        ? "Updating..."
                        : post.status === "published"
                          ? "Move to draft"
                          : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post._id)}
                      disabled={actionId === post._id}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
