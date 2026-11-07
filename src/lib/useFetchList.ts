"use client";

import { useCallback, useEffect, useState } from "react";

export function useFetchList<T>(url: string, key: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json[key] ?? []);
      setError(null);
    } catch {
      setError("Não foi possível carregar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [url, key]);

  useEffect(() => {
    // Fetch-on-mount: setState only happens once the request settles,
    // never synchronously during this effect. The newer
    // react-hooks/set-state-in-effect rule flags any effect that calls a
    // function which *eventually* calls setState, even post-await — there's
    // no data-fetching library (SWR/React Query) in this project to hand
    // this off to, so the disable is intentional here.
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
