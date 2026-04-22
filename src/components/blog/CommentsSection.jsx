import { LoaderCircle, MessageSquareMore, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "../../utils/format";

const CommentsSection = ({ comments, onSubmitComment }) => {
  const { isAuthenticated } = useAuth();
  const { loading, error, request, resetError } = useApi();
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetError();

    try {
      await request(() => onSubmitComment(content), "Failed to post comment.");
      setContent("");
    } catch (submitError) {
      // Error is already handled inside the hook for inline feedback.
    }
  };

  return (
    <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-lg shadow-blue-100/30">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <MessageSquareMore className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Discussion</h2>
          <p className="text-sm text-slate-500">{comments.length} comments so far</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 p-6 text-sm text-slate-600">
            No comments yet. Start the conversation.
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment._id} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{comment.author?.name || "User"}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-blue-600">
                    {comment.author?.role || "reader"}
                  </p>
                </div>
                <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{comment.content}</p>
            </article>
          ))
        )}
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
              <span>{loading ? "Posting..." : "Post comment"}</span>
            </button>
          </form>
        ) : (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 p-6 text-sm text-slate-600">
            Want to comment?{" "}
            <Link to="/auth" className="font-semibold text-blue-700">
              Log in
            </Link>{" "}
            to join the discussion.
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;
