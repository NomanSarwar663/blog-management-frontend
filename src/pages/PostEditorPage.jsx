import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PostForm from "../components/dashboard/PostForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useApi from "../hooks/useApi";
import usePosts from "../hooks/usePosts";
import { extractErrorMessage, parseTagsInput, stringifyTags } from "../utils/format";

const emptyForm = {
  title: "",
  content: "",
  tags: "",
  status: "draft",
};

const PostEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { createPost, getPost, updatePost } = usePosts();
  const { loading, error, request, resetError } = useApi();
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [formData, setFormData] = useState(emptyForm);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPost = async () => {
      setInitialLoading(true);

      try {
        const post = await getPost(id);
        setFormData({
          title: post.title,
          content: post.content,
          tags: stringifyTags(post.tags),
          status: post.status,
        });
      } catch (requestError) {
        setLoadError(extractErrorMessage(requestError, "Failed to load this post."));
      } finally {
        setInitialLoading(false);
      }
    };

    loadPost();
  }, [getPost, id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    resetError();
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: formData.title,
      content: formData.content,
      status: formData.status,
      tags: parseTagsInput(formData.tags),
    };

    try {
      if (isEditMode) {
        await request(() => updatePost(id, payload), "Unable to update the post.");
      } else {
        await request(() => createPost(payload), "Unable to create the post.");
      }

      navigate("/dashboard");
    } catch (submitError) {
      // Inline error is displayed by the form.
    }
  };

  if (initialLoading) {
    return <LoadingSpinner label="Loading post editor..." />;
  }

  if (loadError) {
    return <p className="text-sm text-red-500">{loadError}</p>;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
          {isEditMode ? "Edit Post" : "Create Post"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {isEditMode ? "Refine your blog post" : "Start writing a new story"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use tags for discoverability, keep drafts private until you are ready, and
          publish directly from here when the article is complete.
        </p>
      </div>

      <div className="rounded-[32px] border border-white/70 bg-white p-6 shadow-xl shadow-blue-100/40 sm:p-8">
        <PostForm
          formData={formData}
          error={error}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default PostEditorPage;
