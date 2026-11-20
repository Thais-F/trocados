"use client";

import { useCallback, useEffect, useState } from "react";

export function useFetchOne<T>(url: string, key: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json[key] ?? null);
      setError(null);
    } catch {
      setError("Não foi possível carregar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [url, key]);

  useEffect(() => {
    // Same fetch-on-mount shape as useFetchList — see its comment for why
    // this disable is needed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reload };
}
