import { ArrowLeft, CalendarDays, Tag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import CommentsSection from "../components/blog/CommentsSection";
import LoadingSpinner from "../components/common/LoadingSpinner";
import usePosts from "../hooks/usePosts";
import { extractErrorMessage, formatDate } from "../utils/format";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const { addComment, getComments, getPost } = usePosts();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [nextPost, nextComments] = await Promise.all([getPost(id), getComments(id)]);
      setPost(nextPost);
      setComments(nextComments);
    } catch (loadError) {
      setError(extractErrorMessage(loadError, "Failed to load blog post."));
    } finally {
      setLoading(false);
    }
  }, [getComments, getPost, id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleSubmitComment = async (content) => {
    const comment = await addComment(id, { content });
    setComments((current) => [comment, ...current]);
  };

  if (loading) {
    return <LoadingSpinner label="Loading blog details..." />;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-red-100 bg-white p-8 shadow-lg shadow-red-100/40">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500">
            Unable to load post
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            This blog post is unavailable.
          </h1>
          <p className="mt-4 text-sm text-slate-600">{error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blogs
      </Link>

      <article className="mt-6 rounded-[36px] border border-white/70 bg-white p-8 shadow-2xl shadow-blue-100/50 sm:p-10">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize ${
              post.status === "published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {post.status}
          </span>

          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">{post.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
          <p className="font-semibold text-slate-900">{post.author?.name}</p>
          <p className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            {formatDate(post.createdAt)}
          </p>
        </div>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-6 text-base leading-8 whitespace-pre-wrap text-slate-700">
          {post.content}
        </div>
      </article>

      <div className="mt-8">
        <CommentsSection comments={comments} onSubmitComment={handleSubmitComment} />
      </div>
    </div>
  );
};

export default BlogDetailsPage;
