export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const getExcerpt = (text, maxLength = 160) => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
};

export const parseTagsInput = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const stringifyTags = (tags = []) => tags.join(", ");

export const extractErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message ||
  error?.response?.data?.details?.[0] ||
  error?.message ||
  fallback;
