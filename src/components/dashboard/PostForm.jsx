const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white";

const PostForm = ({ formData, error, loading, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Enter a compelling blog title"
          className={inputClassName}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Tags</span>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={onChange}
          placeholder="react, node, design"
          className={inputClassName}
        />
      </label>
    </div>

    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">Content</span>
      <textarea
        name="content"
        value={formData.content}
        onChange={onChange}
        rows={12}
        placeholder="Write your story here..."
        className={inputClassName}
      />
    </label>

    <label className="block max-w-xs">
      <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
      <select name="status" value={formData.status} onChange={onChange} className={inputClassName}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </label>

    {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Saving..." : "Save post"}
    </button>
  </form>
);

export default PostForm;
