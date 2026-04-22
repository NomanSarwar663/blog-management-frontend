import { useCallback, useState } from "react";

import { postApi, statsApi } from "../lib/api";
import { extractErrorMessage } from "../utils/format";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async ({ scope = "public", filters = {} } = {}) => {
    setLoading(true);
    setError("");

    try {
      const request =
        scope === "mine"
          ? postApi.getMyPosts(filters)
          : postApi.getPublicPosts(filters);

      const { data } = await request;
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
      return data;
    } catch (requestError) {
      setError(extractErrorMessage(requestError, "Failed to load posts."));
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPost = useCallback(async (id) => {
    const { data } = await postApi.getPostById(id);
    return data.post;
  }, []);

  const createPost = useCallback(async (payload) => {
    const { data } = await postApi.createPost(payload);
    return data.post;
  }, []);

  const updatePost = useCallback(async (id, payload) => {
    const { data } = await postApi.updatePost(id, payload);
    return data.post;
  }, []);

  const deletePost = useCallback(async (id) => {
    await postApi.deletePost(id);
  }, []);

  const updatePostStatus = useCallback(async (id, status) => {
    const { data } = await postApi.updateStatus(id, { status });
    return data.post;
  }, []);

  const getComments = useCallback(async (postId) => {
    const { data } = await postApi.getComments(postId);
    return data.comments || [];
  }, []);

  const addComment = useCallback(async (postId, payload) => {
    const { data } = await postApi.addComment(postId, payload);
    return data.comment;
  }, []);

  const getStats = useCallback(async () => {
    const { data } = await statsApi.getPostsStats();
    return data;
  }, []);

  return {
    posts,
    pagination,
    loading,
    error,
    setPosts,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    updatePostStatus,
    getComments,
    addComment,
    getStats,
  };
};

export default usePosts;
