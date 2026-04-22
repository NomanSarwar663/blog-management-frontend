import { ArrowUpRight, CalendarDays, Tag } from "lucide-react";
import { Link } from "react-router-dom";

import { formatDate, getExcerpt } from "../../utils/format";

const BlogCard = ({ post, showStatus = false }) => (
  <article className="group flex h-full flex-col rounded-[28px] border border-white/70 bg-white p-6 shadow-lg shadow-blue-100/40 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/60">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {showStatus ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              post.status === "published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {post.status}
          </span>
        ) : null}
        {post.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
      </div>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition group-hover:bg-blue-600 group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>

    <div className="mt-6 flex-1">
      <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{post.title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{getExcerpt(post.content, 180)}</p>
    </div>

    <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
      <div>
        <p className="text-sm font-semibold text-slate-900">{post.author?.name || "Unknown author"}</p>
        <p className="mt-1 inline-flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(post.createdAt)}
        </p>
      </div>

      <Link
        to={`/posts/${post._id}`}
        className="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
      >
        Read more
      </Link>
    </div>
  </article>
);

export default BlogCard;
