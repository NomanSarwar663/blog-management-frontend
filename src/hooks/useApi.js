import { useCallback, useState } from "react";

import { extractErrorMessage } from "../utils/format";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const request = useCallback(async (callback, fallbackMessage) => {
    setLoading(true);
    setError("");

    try {
      return await callback();
    } catch (requestError) {
      const message = extractErrorMessage(requestError, fallbackMessage);
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError("");
  }, []);

  return {
    loading,
    error,
    request,
    resetError,
  };
};

export default useApi;
